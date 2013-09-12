<?php

namespace NP\property;

use NP\gl\GLAccountGateway;
use NP\property\PropertyGateway;
use NP\system\BaseImportServiceEntityValidator;
use NP\core\db\Select;
use NP\system\IntegrationPackageGateway;

class PropertyEntityValidator extends BaseImportServiceEntityValidator{
    
protected $glaccountGateway, $propertyGateway, $regionGateway, $fiscalcalGateway, $stateGateway, $integrationPackageGateway;

    /**
     * @param GLAccountGateway $glaccountGateway
     * @param PropertyGateway $propertyGateway
     * @param RegionGateway $regionGateway
     * @param FiscalcalGateway $fiscalcalGateway
     * @param StateGateway $stateGateway
     */
    public function __construct(GLAccountGateway $glaccountGateway, PropertyGateway $propertyGateway, 
            RegionGateway $regionGateway, FiscalcalGateway $fiscalcalGateway, StateGateway $stateGateway,
            IntegrationPackageGateway $integrationPackageGateway)
    {
        $this->glaccountGateway = $glaccountGateway;
        $this->propertyGateway = $propertyGateway;
        $this->regionGateway = $regionGateway;
        $this->fiscalGateway = $fiscalcalGateway;
        $this->stateGateway = $stateGateway;
        $this->integrationPackageGateway = $integrationPackageGateway;
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
        $result = $this->integrationPackageGateway->adapter->query($select, array($row['IntegrationPackage']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('IntegrationPackage', 'importFieldIntegrationPackageNameError');
        }

        $select = new Select();
        $select->from('REGION')
            ->columns(array('id' => 'region_id'))
            ->where("region_name = ? or region_name = ?");

        $result = $this->regionGateway->adapter->query($select, array($row['Region'], 'DO NOT USE ' . $row['Region']));
        
        if (empty($result)) {
            $this->addLocalizedErrorMessage('Region', 'importFieldRegionError');
        }

        $select = new Select();
        $select->from('FISCALCAL')
            ->columns(array('id' => 'fiscalcal_id'))
            ->where("fiscalcal_name = ?");
        $result = $this->regionGateway->adapter->query($select, array($row['ClosingCalendar']));
        
        if (empty($result)) {
            $this->addLocalizedErrorMessage('ClosingCalendar', 'importFieldClosingCalendarError');
        }
        
        $select = new Select();
        $select->from('STATE')
            ->columns(array('id' => 'state_id'))
            ->where("state_code = ?");

        $result = $this->stateGateway->adapter->query($select, array($row['State']));
        
         if (empty($result)) {
            $this->addLocalizedErrorMessage('State', 'importFieldStateError');
        }
   }
}
