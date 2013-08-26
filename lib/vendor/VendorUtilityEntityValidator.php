<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/26/13
 * Time: 3:06 PM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;


use \Pimple as Container;
use NP\system\BaseImportServiceEntityValidator;

/**
 * Class VendorUtilityEntityValidator
 * @package NP\vendor
 *
 * @property \NP\vendor\VendorGateway $VendorGateway
 */
class VendorUtilityEntityValidator extends BaseImportServiceEntityValidator
{
    /**
     * @var Container
     */
    protected $di;

    /**
     * @param Container $di set by Pimple di bootstrap
     */
    public function setPimple(Container $di)
    {
        $this->di = $di;
    }

    /**
     * Magic method to get Gateways easy
     *
     * @param $key
     * @return mixed
     */
    public function __get($key)
    {
        return $this->di[$key];
    }

    /**
     * @param \NP\core\db\Adapter $adapter
     */
    public function __construct(\NP\core\db\Adapter $adapter)
    {
        $this->adapter = $adapter;
    }

    /**
     * @param \ArrayObject $row
     * @param \ArrayObject $errors
     * @return BaseImportServiceEntityValidator
     */
    protected function validate(\ArrayObject $row, \ArrayObject $errors)
    {

        $vendorName = $row['Vendor_ID'];
        $result = $this->adapter->query('SELECT vs.vendorsite_id FROM vendorsite vs INNER JOIN vendor v ON vs.vendor_id=v.vendor_id AND ltrim(rtrim(vs.vendorsite_id_alt))=ltrim(rtrim(?)) WHERE vs.approval_tracking_id=vs.vendorsite_id', array($vendorName));
        $vendorId = !empty($result[0])?$result[0]['vendorsite_id']:null;
        $this->addLocalizedErrorMessageIfNull($vendorId, 'Vendor_ID', 'Invalid Vendor');

        $utilityName = $row['Utility_Type'];
        $result = $this->adapter->query('SELECT utilitytype_id FROM utilitytype WHERE utilitytype = ?', array($utilityName));
        $utilityTypeId = !empty($result[0])?$result[0]['utilitytype_id']:null;
        $this->addLocalizedErrorMessageIfNull($utilityTypeId, 'Utility_Type', 'Invalid Utility Type');

        $glaccountName = $row['GL_Account'];
        $result = $this->adapter->query('SELECT glaccount_id FROM glaccount	WHERE ltrim(rtrim(glaccount_number))=ltrim(rtrim(?))', array($glaccountName));
        $glaccountId = !empty($result[0])?$result[0]['glaccount_id']:null;
        $this->addLocalizedErrorMessageIfNull($glaccountId, 'GL_Account', 'Invalid GL Account');

        $propertyName = $row['Property_ID'];
        $result = $this->adapter->query('SELECT property_id FROM property WHERE ltrim(rtrim(property_id_alt))=ltrim(rtrim(?))', array($propertyName));
        $propertyId = !empty($result[0])?$result[0]['property_id']:null;
        $this->addLocalizedErrorMessageIfNull($propertyId, 'Property_ID', 'Invalid Property');

        $unitName = $row['Unit_Id'];
        $result = $this->adapter->query('SELECT unit_id From unit WHERE ltrim(rtrim(unit_id_alt))=ltrim(rtrim(?)) AND property_id = ?', array($unitName, $propertyId));
        $unitId = !empty($result[0])?$result[0]['unit_id']:null;
        $this->addLocalizedErrorMessageIfNull($unitId, 'Unit_Id', 'Invalid Unit');


    }
}
