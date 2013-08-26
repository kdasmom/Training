<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/20/13
 * Time: 10:48 AM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;


use NP\gl\GLAccountGateway;
use NP\property\PropertyGateway;
use NP\system\BaseImportServiceEntityValidator;
use NP\core\db\Select;

class VendorFavoriteEntityValidator extends BaseImportServiceEntityValidator {

    protected $glaccountGateway, $propertyGateway, $vendorGateway;

    /**
     * @param GLAccountGateway $glaccountGateway
     * @param PropertyGateway $propertyGateway
     * @param VendorGateway $vendorGateway
     */
    public function __construct(GLAccountGateway $glaccountGateway, PropertyGateway $propertyGateway, VendorGateway $vendorGateway)
    {
        $this->glaccountGateway = $glaccountGateway;
        $this->propertyGateway = $propertyGateway;
        $this->vendorGateway = $vendorGateway;
    }

    /**
     * @param \ArrayObject $row
     * @param \ArrayObject $errors
     * @return BaseImportServiceEntityValidator|void
     */
    protected function validate(\ArrayObject $row, \ArrayObject $errors)
    {
        $select = new Select();
        $select ->from('integrationpackage')
                ->columns(array('id' => 'integration_package_id'))
                ->where("integration_package_name = ?");

        $resultVendor = $this->glaccountGateway->adapter->query($select, array($row['IntegrationPackage']));

        if (empty($resultVendor)) {
            $this->addLocalizedErrorMessage('IntegrationPackage', 'importFieldIntegrationPackageNameError');
        }

        $select = new Select();
        $select ->from('property')
            ->columns(array('id' => 'property_id'))
            ->where("property_id_alt = ? AND integration_package_id = ?");

        $result = $this->propertyGateway->adapter->query($select, array($row['PropertyCode'], @$resultVendor[0]['id']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('PropertyCode', 'importFieldPropertyCodeError');
        }

        $select = new Select();
        $select ->from('vendor')
            ->columns(array('id' => 'vendor_id'))
            ->where("vendor_id_alt = ? AND integration_package_id = ?");

        $result = $this->propertyGateway->adapter->query($select, array($row['VendorCode'], @$resultVendor[0]['id']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('VendorCode', 'importFieldVendorCodeError');
        }

    }

}
