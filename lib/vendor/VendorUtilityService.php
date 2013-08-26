<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/26/13
 * Time: 3:05 PM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;


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
        $result = $this->adapter->query('SELECT vs.vendorsite_id FROM vendorsite vs INNER JOIN vendor v ON vs.vendor_id=v.vendor_id AND ltrim(rtrim(vs.vendorsite_id_alt))=ltrim(rtrim(?)) WHERE vs.approval_tracking_id=vs.vendorsite_id', array($vendorName));
        $vendorId = !empty($result[0])?$result[0]['vendorsite_id']:null;

        $utilityName = $row['Utility_Type'];
        $result = $this->adapter->query('SELECT utilitytype_id FROM utilitytype WHERE utilitytype = ?', array($utilityName));
        $utilityTypeId = !empty($result[0])?$result[0]['utilitytype_id']:null;

        $glaccountName = $row['GL_Account'];
        $result = $this->adapter->query('SELECT glaccount_id FROM glaccount	WHERE ltrim(rtrim(glaccount_number))=ltrim(rtrim(?))', array($glaccountName));
        $glaccountId = !empty($result[0])?$result[0]['glaccount_id']:null;

        $propertyName = $row['Property_ID'];
        $result = $this->adapter->query('SELECT property_id FROM property WHERE ltrim(rtrim(property_id_alt))=ltrim(rtrim(?))', array($propertyName));
        $propertyId = !empty($result[0])?$result[0]['property_id']:null;

        $unitName = $row['Unit_Id'];
        $result = $this->adapter->query('SELECT unit_id From unit WHERE ltrim(rtrim(unit_id_alt))=ltrim(rtrim(?)) AND property_id = ?', array($unitName, $propertyId));
        $unitId = !empty($result[0])?$result[0]['unit_id']:null;

        $entityData = array(
            'vendor_id_alt' => $vendorName,
            'vendorsite_id' => $vendorId,
            'utility_type' => $utilityName,
            'utilitytype_id' => $utilityTypeId,
            'account_number' => $glaccountName,
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
                // Save the glaccount record
                $this->gateway->save($entity);
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
