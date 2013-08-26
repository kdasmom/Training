<?php

namespace NP\property;

use NP\gl\GLAccountGateway;
use NP\property\PropertyGateway;
use NP\system\BaseImportServiceEntityValidator;
use NP\core\db\Select;

class UnitTypeEntityValidator extends BaseImportServiceEntityValidator{

  protected $glaccountGateway, $propertyGateway;

    /**
     * @param GLAccountGateway $glaccountGateway
     * @param PropertyGateway $propertyGateway
     */
    public function __construct(GLAccountGateway $glaccountGateway, PropertyGateway $propertyGateway)
    {
        $this->glaccountGateway = $glaccountGateway;
        $this->propertyGateway = $propertyGateway;
    }

    /**
     * @param \ArrayObject $row
     * @param \ArrayObject $errors
     * @return BaseImportServiceEntityValidator|void
     */
    protected function validate(\ArrayObject $row, \ArrayObject $errors)
    {
        $select = new Select();
        $select ->from('INTEGRATIONPACKAGE')
                ->columns(array('id' => 'integration_package_id'))
                ->where("integration_package_name = ?");

        $resultPropertyGL = $this->glaccountGateway->adapter->query($select, array($row['IntegrationPackage']));

        if (empty($resultPropertyGL)) {
            $this->addLocalizedErrorMessage('IntegrationPackage', 'importFieldIntegrationPackageNameError');
        }

        $select = new Select();
        $select ->from('PROPERTY')
            ->columns(array('id' => 'property_id'))
            ->where("property_id_alt = ? AND integration_package_id = ?");

        $result = $this->propertyGateway->adapter->query($select, array($row['PropertyCode'], @$resultPropertyGL[0]['id']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('PropertyCode', 'importFieldPropertyCodeError');
        }
   }
}
