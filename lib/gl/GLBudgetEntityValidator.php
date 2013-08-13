<?php

namespace NP\gl;

use NP\locale\LocalizationService;
use NP\system\ConfigService;

use NP\budget\BudgetGateway;
use NP\budget\GlAccountYearGateway;

use NP\core\db\Select;
use NP\core\db\Insert;
use NP\core\db\Update;

class GLBudgetEntityValidator {

    /**
     * @var \NP\system\ConfigService The config service singleton
     */
    protected $configService;

    protected $localizationService;

    protected $GLAccountGateway, $budgetGateway, $glAccountYearGateway;

   public function __construct(GLAccountGateway $gateway, BudgetGateway $budgetGateway, GlAccountYearGateway $glAccountYearGateway) {
		$this->GLAccountGateway     = $gateway;
                $this->budgetGateway        = $budgetGateway;
		$this->glAccountYearGateway = $glAccountYearGateway;
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
        $glaccount_id = $this->getGLAccountIdByName($row['GLAccount']);
        $integrationPackageId = $this->getIntegrationPackageIdByName($row['IntegrationPackage']);
        // Check the Category Name in DB
        if (is_null($glaccount_id)) {
            $errors[] = array(
                'field' => 'glaccountName',
                'msg'   => $this->localizationService->getMessage('importFieldGLAccountNameError'),
                'extra' => null
            );
            $row['GLAccount'] .= ';' . $this->localizationService->getMessage('importFieldGLAccountNameError');
        }
        
        // Check the Integration Package Name in DB
        if (is_null($integrationPackageId)) {
            $errors[] = array(
                'field' => 'integrationPackageName',
                'msg'   => $this->localizationService->getMessage('importFieldIntegrationPackageNameError'),
                'extra' => null
            );
            $row['IntegrationPackage'] .= ';' . $this->localizationService->getMessage('importFieldIntegrationPackageNameError');

        }

            $row['validation_status'] = (count($errors)) ? 'invalid' : 'valid';
    }

    public function getGLAccountIdByName($glaccount_name)
    {
        $select = new Select();
        $select->from('GLACCOUNT')
            ->columns(array('id' => 'glaccount_id'))
            ->where("glaccount_name = ?");

        $result = $this->GLAccountGateway->adapter->query($select, array($glaccount_name));
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
    public function getGLAccountYearIdByYear($glaccount_id, $glaccountyear_year, $property_id) {
        $query = new Select();
        $query->from('glaccountyear')
            ->column('glaccountyear_id')
            ->where('glaccount_id = ? AND glaccountyear_year = ? AND property_id = ?');
        $result = $this->glAccountYearGateway->adapter->query($query, array($glaccount_id, $glaccountyear_year, $property_id));
        return (!empty($result[0]['id'])) ? $result[0]['glaccountyear_id'] : null;
    }
    public function glbudgetExists($glaccountyear_id, $budget_period, $budget_status)
    {
        $query = new Select();
        $query->from('budget')
            ->column('budget_id')
            ->where('glaccountyear_id = ? AND budget_period = ? AND budget_status = ?');
        $result = $this->GLAccountGateway->adapter->query($query, array($glaccountyear_id, $budget_period, $budget_status));
        $result = !empty($result)?$result[0]['budget_id']:false;
        return $result;
    }
}
