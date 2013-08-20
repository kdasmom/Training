<?php

namespace NP\property;

use NP\core\db\Select;
use NP\core\db\Insert;
use NP\core\db\Update;

class PropertyGLEntityValidator {

    /**
     * @var \NP\system\ConfigService The config service singleton
     */
    protected $configService;

    protected $localizationService;

    protected $propertyGlAccountGateway;

    public function __construct(PropertyGlAccountGateway $gateway)
    {
        $this->propertyGlAccountGateway = $gateway;
    }


    /**
     * Setter function required by DI to set the config service via setter injection
     * @param \NP\system\ConfigService $configService
     */
    public function setConfigService(\NP\system\ConfigService $configService) {
        $this->configService = $configService;
    }

    public function setLocalizationService(LocalizationService $localizationService)
    {
        $this->localizationService = $localizationService;
    }

    public function validateRow(&$row, $errors)
    {
        $propertyId = $this->getPropertyIdByCode($row['PropertCode']);
        $glaccountId = $this->getGlAccountIdByCode($row['GLCode']);
        $integrationPackageId = $this->getIntegrationPackageIdByName($row['IntegrationPackage']);        
        if (is_null($propertyId)) {
            $errors[] = array(
                'field' => 'propertyCode',
                'msg'   => $this->localizationService->getMessage('importFieldPropertyCodeError'),
                'extra' => null
            );
            $row['PropertyCode'] .= ';' . $this->localizationService->getMessage('importFieldPropertyCodeError');
        }
        
        if (is_null($glaccountId)) {
            $errors[] = array(
                'field' => 'GLCode',
                'msg'   => $this->localizationService->getMessage('importFieldGLCodeError'),
                'extra' => null
            );
            $row['GLCode'] .= ';' . $this->localizationService->getMessage('importFieldGLCodeError');
        }

        if (is_null($integrationPackageId)) {
            $errors[] = array(
                'field' => 'integrationPackageName',
                'msg'   => $this->localizationService->getMessage('importFieldIntegrationPackageNameError'),
                'extra' => null
            );
            $row['IntegrationPackageName'] .= ';' . $this->localizationService->getMessage('importFieldIntegrationPackageNameError');
        }

        $row['validation_status'] = (count($errors)) ? 'invalid' : 'valid';
    }

    public function propertyGlAccountExists($propertyId, $glaccountId)
    {
        $query = new Select();
        $query->from('PROPERTYGLACCOUNT')
            ->column('propertyglaccount_id')
            ->where('property_id = ? AND glaccount_id ?');
        $result = $this->propertyGlAccountGateway->adapter->query($query, array($propertyId, $glaccountId));
        $result = !empty($result) ? $result[0]['propertyglaccount_id'] : false;
        return $result;
    }
    
    public function getPropertyIdByCode($property_id_alt)
    {
        $select = new Select();
        $select->from('PROPERTY')
            ->columns(array('id' => 'property_id'))
            ->where("property_id_alt = ?");

        $result = $this->propertyGlAccountGateway->adapter->query($select, array($property_id_alt));
        return (!empty($result[0]['id'])) ? $result[0]['id'] : null;
    }
    
    public function getGlAccountIdByCode($glaccount_number)
    {
        $select = new Select();
        $select->from('GLACCOUNT')
            ->columns(array('id' => 'glaccount_id'))
            ->where("glaccount_number = ?");

        $result = $this->propertyGlAccountGateway->adapter->query($select, array($glaccount_number));
        return (!empty($result[0]['id'])) ? $result[0]['id'] : null;
    }
   
    public function getIntegrationPackageIdByName($integrationPackageName)
    {
        $select = new Select();
        $select->from('integrationpackage')
            ->columns(array('id' => 'integration_package_id'))
            ->where("integration_package_name = ?");

        $result = $this->PropertyGateway->adapter->query($select, array($integrationPackageName));
        return (!empty($result[0]['id'])) ? $result[0]['id'] : null;
    }
    
}
