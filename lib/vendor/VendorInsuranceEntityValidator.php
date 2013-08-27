<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/27/13
 * Time: 11:23 AM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;


use NP\system\BaseImportServiceEntityValidator;

class VendorInsuranceEntityValidator extends BaseImportServiceEntityValidator
{

    /**
     * @var \NP\core\db\Adapter
     */
    protected $adapter;

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
        $integrationPackageName = $row['Integration Package Name'];
        $vendorName = $row['Vendor ID'];
        $insutanceTypeName = $row['Insurance Type'];
        $companyName = $row['Company'];
        $policyNumber = $row['Policy Number'];
        $effectiveDate = $row['Effective Date'];
        $expirationDate = $row['Expiration Date'];
        $policyLimit = $row['Policy Limit'];
        $additionalInsured = $row['Additional Insured'];
        $propertyName = $row['Property ID'];

        $query = "SELECT integration_package_id FROM integrationpackage WHERE integration_package_name = ?";
        $result = $this->adapter->query($query, array($integrationPackageName));
        $integrationPackageId = !empty($result[0])?$result[0]['integration_package_id']:null;
        $this->addLocalizedErrorMessageIfNull($integrationPackageId, 'Integration Package Name', 'Invalid Integration PAckage');

        $query = "SELECT vendor_id FROM vendor WHERE vendor_id_alt = ? AND integration_package_id = ?";
        $result = $this->adapter->query($query, array($vendorName, $integrationPackageId));
        $vendorId = !empty($result[0])?$result[0]['vendor_id']:null;
        $this->addLocalizedErrorMessageIfNull($vendorId, 'Vendor ID', 'Invalid Vendor');

        $query = "SELECT property_id FROM property WHERE property_id_alt = ?";
        $result = $this->adapter->query($query, array($propertyName));
        $propertyId = !empty($result[0])?$result[0]['property_id']:null;
        $this->addLocalizedErrorMessageIfNull($propertyId, 'Property ID', 'Invalid Property');

        $query = "SELECT insurancetype_id FROM insurancetype WHERE insurancetype_name = ?";
        $result = $this->adapter->query($query, array($insutanceTypeName));
        $insuranceTypeId = !empty($result[0])?$result[0]['insurancetype_id']:null;
        $this->addLocalizedErrorMessageIfNull($insuranceTypeId, 'Insurance Type', 'Invalid Insurance Type');

    }
}
