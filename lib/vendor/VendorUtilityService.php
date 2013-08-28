<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/26/13
 * Time: 3:05 PM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;


use NP\core\db\Insert;
use NP\core\db\Select;
use NP\core\db\Update;
use NP\system\BaseImportService;

class VendorUtilityService extends BaseImportService
{
    /**
    * @var VendorUtilityGateway
     */
    protected $gateway;

    public function __construct(\NP\vendor\VendorUtilityGateway $gateway)
    {
        $this->gateway = $gateway;
    }

    /**
     * This must be implemented in child class.
     * Method accept row and entity class to save in related gateway.
     *
     * @param \ArrayObject $data Row array for entity defined in next param
     * @param string $entityClass Entity class to map data
     */
    public function save(\ArrayObject $row, $entityClass)
    {
        $vendorName = $row['Vendor_ID'];
        $result = $this->gateway->adapter->query('SELECT vs.vendorsite_id FROM vendorsite vs INNER JOIN vendor v ON vs.vendor_id=v.vendor_id AND ltrim(rtrim(vs.vendorsite_id_alt))=ltrim(rtrim(?)) WHERE vs.approval_tracking_id=vs.vendorsite_id', array($vendorName));
        $vendorId = !empty($result[0])?$result[0]['vendorsite_id']:null;

        $utilityTypeName = $row['Utility_Type'];
        $result = $this->gateway->adapter->query('SELECT utilitytype_id FROM utilitytype WHERE utilitytype = ?', array($utilityTypeName));
        $utilityTypeId = !empty($result[0])?$result[0]['utilitytype_id']:null;

        $glaccountName = $row['GL_Account'];
        $result = $this->gateway->adapter->query('SELECT glaccount_id FROM glaccount	WHERE ltrim(rtrim(glaccount_number))=ltrim(rtrim(?))', array($glaccountName));
        $glaccountId = !empty($result[0])?$result[0]['glaccount_id']:null;

        $propertyName = $row['Property_ID'];
        $result = $this->gateway->adapter->query('SELECT property_id FROM property WHERE ltrim(rtrim(property_id_alt))=ltrim(rtrim(?))', array($propertyName));
        $propertyId = !empty($result[0])?$result[0]['property_id']:null;

        $unitName = $row['Unit_Id'];
        $result = $this->gateway->adapter->query('SELECT unit_id From unit WHERE ltrim(rtrim(unit_id_alt))=ltrim(rtrim(?)) AND property_id = ?', array($unitName, $propertyId));
        $unitId = !empty($result[0])?$result[0]['unit_id']:null;

        $entityData = array(
            'vendor_id_alt' => $vendorName,
            'vendorsite_id' => $vendorId,
            'utility_type' => $utilityTypeName,
            'utilitytype_id' => $utilityTypeId,
            'account_number' => $row['Account_Number'],
            'glaccount_id' => $glaccountId,
            'userprofile_id'=> $this->securityService->getUserId(),
            'property_code' => $propertyName,
            'property_id' => $propertyId,
            'unit_code' => $unitName,
            'unit_id' => $unitId,
            'meter_number' => $row['Meter_Number'],
            'default_glcode' => $glaccountId
        );

        $entity = new $entityClass($entityData);
        $errors = $this->validate($entity);




        // If the data is valid, save it
        if (count($errors) == 0) {
            // Begin transaction

            $this->gateway->beginTransaction();

            try {
                $select = new Select('utility');
                $select->column('utility_id')
                    ->where('utilitytype_id = ? and vendorsite_id = ?');

                $result = $this->gateway->adapter->query($select, array($utilityTypeId, $vendorId));
                $utilityId = !empty($result[0])?$result[0]['utility_id']:null;

                if(empty($result)) {
                    $insert = new Insert();
                    $insert->into('Utility')
                        ->columns(array('UtilityType_Id', 'Property_Id', 'Vendorsite_Id'))
                        ->values(array($utilityTypeId, $propertyId, $vendorId));

                    $this->gateway->adapter->query($insert);

                    $update = new Update('UtilityAccount');
                    $update->value('glaccount_id', $glaccountId);
                    $update->value('unit_id', $unitId);
                    $update->where('property_id = ? AND UtilityAccount_AccountNumber = ? AND UtilityAccount_MeterSize = ?');

                    $this->gateway->adapter->query($update, array($propertyId, $row['Account_Number'], $row['Meter_Number']));
                } else {

                    $select = new Select('utilityaccount');
                    $select->where('Utility_Id = ? AND UtilityAccount_AccountNumber = ? AND property_id = ? AND UtilityAccount_MeterSize = ?');
                    $selectResult = $this->gateway->adapter->query($select, array($utilityId, $row['Account_Number'], $propertyId, $row['Meter_Number']));

                    if(empty($selectResult)) {
                        $insert = new Insert('UtilityAccount');
                        $insert->columns(array('Utility_Id', 'UtilityAccount_AccountNumber', 'property_id', 'glaccount_id', 'unit_id', 'UtilityAccount_MeterSize', 'utilityaccount_active'));
                        $insert->values(array($utilityId, $row['Account_Number'], $propertyId, $glaccountId, $unitId, $row['Meter_Number'], 1));
                    }
                }

                $select = new Select('vendorglaccounts');
                $select->where('vendor_id = ? AND glaccount_id = ?');
                $vendorGLAccountsSelect = $this->gateway->adapter->query($select, array($vendorId, $glaccountId));

                if(empty($vendorGLAccountsSelect)) {
                    $insert = new Insert('vendorglaccounts');
                    $insert->columns(array('vendor_id', 'glaccount_id'));
                    $insert->values(array($vendorId, $glaccountId));

                    $this->gateway->adapter->query($select, array($vendorId, $glaccountId));
                }


            } catch(\Exception $e) {
                // Add a global error to the error array
                $errors[] = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e), 'extra'=>null);
            }
        }

        if (count($errors)) {
            $this->gateway->rollback();
        } else {
            $this->gateway->commit();
        }
    }

}
