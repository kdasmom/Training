<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/12/13
 * Time: 12:25 PM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\gl;

use NP\locale\LocalizationService;
use NP\system\BaseImportServiceEntityValidator;
use NP\system\ConfigService;

use NP\core\db\Select;
use NP\core\db\Insert;
use NP\core\db\Update;

class GLAccountEntityValidator extends BaseImportServiceEntityValidator {

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

    public function validate(\ArrayObject $row, \ArrayObject $errors)
    {
        // Get Id for field glaccounttype_id, integrationPackageId, glaccount_level
        $glaccounttype_id = $this->getAccountTypeIdByName($row['AccountType']);
        $integrationPackageId = $this->getIntegrationPackageIdByName($row['IntegrationPackageName']);
        $glaccount_level = $this->getCategoryIdByName($row['CategoryName'], $integrationPackageId);

        // Check the GLAccount Type in DB
        $this->addLocalizedErrorMessageIfNull($glaccounttype_id, 'AccountType', 'importFieldAccountTypeError');

        // Check the Integration Package Name in DB
        $this->addLocalizedErrorMessageIfNull($integrationPackageId, 'IntegrationPackageName', 'importFieldIntegrationPackageNameError');

        // Check the Category Name in DB
        $this->addLocalizedErrorMessageIfNull($glaccount_level, 'CategoryName', 'importFieldCategoryNameError');
    }

    public function glaccountExists($glaccount_number, $integration_package_id)
    {
        $query = new Select();
        $query->from('glaccount')
            ->column('glaccount_id')
            ->where('glaccount_number = ? AND integration_package_id = ? AND glaccounttype_id IS NOT NULL');
        $result = $this->GLAccountGateway->adapter->query($query, array($glaccount_number, $integration_package_id));
        $result = !empty($result)?$result[0]['glaccount_id']:false;
        return $result;
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

    public function getAccountTypeIdByName($accountType)
    {
        $select = new Select();
        $select->from(array('g' => 'GLACCOUNTTYPE'))
            ->columns(array('id' => 'glaccounttype_id'))
            ->where("g.glaccounttype_name= ?");

        $result = $this->GLAccountGateway->adapter->query($select, array($accountType));
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
