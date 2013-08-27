<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/27/13
 * Time: 3:19 PM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;


use NP\system\BaseImportServiceEntityValidator;

class VendorGLEntityValidator extends BaseImportServiceEntityValidator
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
        $vendorName = $row['VendorCode'];
        $glCodes = $row['GLCodes'];
        $integrationPackageName = $row['Integration Package'];

        $query = "SELECT integration_package_id FROM integrationpackage WHERE integration_package_name = ?";
        $result = $this->adapter->query($query, array($integrationPackageName));
        $integrationPackageId = !empty($result[0])?$result[0]['integration_package_id']:null;
        $this->addLocalizedErrorMessageIfNull($integrationPackageId, 'Integration Package', 'Invalid Integration Package');

        $query = "SELECT vendor_id FROM vendor WHERE vendor_id_alt = ? AND integration_package_id = ?";
        $result = $this->adapter->query($query, array($vendorName, $integrationPackageId));
        $vendorId = !empty($result[0])?$result[0]['vendor_id']:null;
        $this->addLocalizedErrorMessageIfNull($vendorId, 'VendorCode', 'Invalid Vendor/Integration Combo');

        $query = "SELECT glaccount_id FROM glaccount WHERE glaccount_number = ?";
        $result = $this->adapter->query($query, array($glCodes));
        $glaccountId = !empty($result[0])?$result[0]['glaccount_id']:null;
        $this->addLocalizedErrorMessageIfNull($glaccountId, 'GLCodes', 'Invalid GL Codes');

        $query = "SELECT TOP 1 1 FROM vendorglaccounts WHERE glaccount_id= ? AND vendor_id = ?";
        $result = $this->adapter->query($query, array($glaccountId, $vendorId));

        if(!empty($result[0])) {
            $this->addLocalizedErrorMessage('VendorCode', 'Vendor GL Assignment Already Exists');
            $this->addLocalizedErrorMessage('GLCodes', 'Vendor GL Assignment Already Exists');
            $this->addLocalizedErrorMessage('Integration Package', 'Vendor GL Assignment Already Exists');
        }

    }
}
