<?php

namespace NP\gl;

use NP\locale\LocalizationService;
use NP\system\ConfigService;

use NP\core\db\Select;
use NP\core\db\Insert;
use NP\core\db\Update;

class GLCAtegoryEntityValidator {

    /**
     * @var \NP\system\ConfigService The config service singleton
     */
    protected $configService;

    protected $localizationService;

    protected $GLAccountGateway;

    public function __construct(GLAccountGateway $gateway)
    {
        $this->GLAccountGateway = $gateway;
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
        // Get Id for field integrationPackageId, glaccount_level
        $integrationPackageId = $this->getIntegrationPackageIdByName($row['IntegrationPackage']);
        $glaccount_level = $this->getCategoryIdByName($row['CategoryName'], $integrationPackageId);
        $glaccountName = $row['CategoryName'];
        $glaccounttype_id = null;
        $row['AccountNumber'] = substr($glaccountName, 0, 50);
        $row['AccountType'] = $glaccounttype_id;
        $row['GLAccountName'] = $glaccountName;
        $row['IntegrationPackageName'] = $row['IntegrationPackage'];
        // Check the Integration Package Name in DB
        if (is_null($integrationPackageId)) {
            $errors[] = array(
                'field' => 'integrationPackageName',
                'msg'   => $this->localizationService->getMessage('importFieldIntegrationPackageNameError'),
                'extra' => null
            );
            $row['IntegrationPackage'] .= ';' . $this->localizationService->getMessage('importFieldIntegrationPackageNameError');

        }

        // Check the Category Name in DB
        if (is_null($glaccount_level)) {
            $errors[] = array(
                'field' => 'categoryName',
                'msg'   => $this->localizationService->getMessage('importFieldCategoryNameError'),
                'extra' => null
            );
            $row['CategoryName'] .= ';' . $this->localizationService->getMessage('importFieldCategoryNameError');
        }
            $row['validation_status'] = (count($errors)) ? 'invalid' : 'valid';
    }

    public function getCategoryIdByName($categoryName, $integrationPackageId)
    {
        $select = new Select();
        $select->from('GLACCOUNT')
            ->columns(array('id' => 'glaccount_id'))
            ->where("glaccount_name = ?	AND glaccounttype_id IS NULL AND integration_package_id = ?");

        $result = $this->GLAccountGateway->adapter->query($select, array($categoryName, $integrationPackageId));
        return (!empty($result[0]['id'])) ? $result[0]['id'] : null;
    }

    public function getIntegrationPackageIdByName($integrationPackageName)
    {
        $select = new Select();
        $select->from('integrationpackage')
            ->columns(array('id' => 'integration_package_id'))
            ->where("integration_package_name = ?");

        $result = $this->GLAccountGateway->adapter->query($select, array($integrationPackageName));
        return (!empty($result[0]['id'])) ? $result[0]['id'] : null;
    }
}
