<?php

namespace NP\property;

use NP\locale\LocalizationService;
use NP\system\ConfigService;

use NP\core\db\Select;
use NP\core\db\Insert;
use NP\core\db\Update;

class PropertyEntityValidator {

    /**
     * @var \NP\system\ConfigService The config service singleton
     */
    protected $configService;

    protected $localizationService;

    protected $GLAccountGateway;

    public function __construct(PropertyGateway $gateway)
    {
        $this->PropertyGateway = $gateway;
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

    public function validate(&$row, $errors)
    {
        // Get Id for field glaccounttype_id, integrationPackageId, glaccount_level
        $regionId = $this->getRegionIdByName($row['Region']);
        $integrationPackageId = $this->getIntegrationPackageIdByName($row['IntegrationPackage']);
        $ClosingCalendarId = $this->getClosingCalendarIdByName($row['ClosingCalendar']);
        $StateId = $this->getStateIdByName($row['State']);
        
        if (is_null($regionId)) {
            $errors[] = array(
                'field' => 'region',
                'msg'   => $this->localizationService->getMessage('importFieldRegionError'),
                'extra' => null
            );
            $row['Region'] .= ';' . $this->localizationService->getMessage('importFieldRegionError');
        }

        if (is_null($integrationPackageId)) {
            $errors[] = array(
                'field' => 'integrationPackageName',
                'msg'   => $this->localizationService->getMessage('importFieldIntegrationPackageNameError'),
                'extra' => null
            );
            $row['IntegrationPackageName'] .= ';' . $this->localizationService->getMessage('importFieldIntegrationPackageNameError');
        }
        
        if (is_null($ClosingCalendarId)) {
            $errors[] = array(
                'field' => 'region',
                'msg'   => $this->localizationService->getMessage('importFieldClosingCalendarError'),
                'extra' => null
            );
            $row['ClosingCalendar'] .= ';' . $this->localizationService->getMessage('importFieldClosingCalendarError');
        }

        if (is_null($StateId)) {
            $errors[] = array(
                'field' => 'state',
                'msg'   => $this->localizationService->getMessage('importFieldStateError'),
                'extra' => null
            );
            $row['State'] .= ';' . $this->localizationService->getMessage('importFieldStateError');
        }
        $row['validation_status'] = (count($errors)) ? 'invalid' : 'valid';
    }

    public function propertyExists($propertyIdAlt)
    {
        $query = new Select();
        $query->from('PROPERTY')
            ->column('property_id')
            ->where('property_id_alt = ?');
        $result = $this->PropertyGateway->adapter->query($query, array($propertyIdAlt));
        $result = !empty($result) ? $result[0]['property_id'] : false;
        return $result;
    }

   public function getCustomField($customfield_name, $customfield_pn_type)
    {
        $select = new Select();
        $select->from('PNCUSTOMFIELDS')
            ->columns('customfield_label')
            ->where("customfield_name = ? AND customfield_pn_type = ?");

        $result = $this->PropertyGateway->adapter->query($select, array($customfield_name, $customfield_pn_type));
        return (!empty($result[0]['customfield_label'])) ? $result[0]['customfield_label'] : null;
    }
    
    public function getRegionIdByName($regionName)
    {
        $select = new Select();
        $select->from('REGION')
            ->columns(array('id' => 'region_id'))
            ->where("region_name = ?");

        $result = $this->PropertyGateway->adapter->query($select, array($regionName));
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
    
    public function getClosingCalendarIdByName($ClosingCalendarName)
    {
        $select = new Select();
        $select->from('FISCALCAL')
            ->columns(array('id' => 'fiscalcal_id'))
            ->where("fiscalcal_name = ?");

        $result = $this->PropertyGateway->adapter->query($select, array($ClosingCalendarName));
        return (!empty($result[0]['id'])) ? $result[0]['id'] : null;
    }
    
    public function getStateIdByName($State)
    {
        $select = new Select();
        $select->from('STATE')
            ->columns(array('id' => 'state_id'))
            ->where("state_code = ?");

        $result = $this->PropertyGateway->adapter->query($select, array($State));
        return (!empty($result[0]['id'])) ? $result[0]['id'] : null;
    }
}
