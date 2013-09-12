<?php

namespace NP\budget;

use NP\gl\GLAccountGateway;
use NP\system\BaseImportServiceEntityValidator;

class BudgetEntityValidator extends BaseImportServiceEntityValidator{

    protected $glaccountGateway, $glAccountYearGateway;

    public function __construct(GLAccountGateway $glaccountGateway, GlAccountYearGateway $glAccountYearGateway) {
                $this->glaccountGateway     = $glaccountGateway;
		$this->glAccountYearGateway = $glAccountYearGateway;
	}

    protected function validate(\ArrayObject $row, \ArrayObject $errors)
    {
        
        $select = new Select();
        $select ->from('GLACCOUNT')
            ->columns(array('id' => 'glaccount_id'))
            ->where("glaccount_number = ? AND integration_package_id = ?");

        $result = $this->glaccountGateway->adapter->query($select, array($row['GLCode'], @$resultPropertyGL[0]['id']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('GLCode', 'importFieldGLCodeError');
        }  
        
        $select = new Select();
        $select ->from('INTEGRATIONPACKAGE')
                ->columns(array('id' => 'integration_package_id'))
                ->where("integration_package_name = ?");

        $resultPropertyGL = $this->integrationPackageGateway->adapter->query($select, array($row['IntegrationPackage']));

        if (empty($resultPropertyGL)) {
            $this->addLocalizedErrorMessage('IntegrationPackage', 'importFieldIntegrationPackageNameError');
        }
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
