<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/20/13
 * Time: 10:48 AM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;


use NP\system\BaseImportServiceEntityValidator;

class VendorFavoriteEntityValidator extends BaseImportServiceEntityValidator {

    // TODO
    public function validate(&$row, &$errors)
    {
        // Get Id for field glaccounttype_id, integrationPackageId, glaccount_level
        $glaccounttype_id = $this->getAccountTypeIdByName($row['AccountType']);
        $integrationPackageId = $this->getIntegrationPackageIdByName($row['IntegrationPackageName']);
        $glaccount_level = $this->getCategoryIdByName($row['CategoryName'], $integrationPackageId);
        // Check the GLAccount Type in DB
        if (is_null($glaccounttype_id)) {
            $errors[] = array(
                'field' => 'accountType',
                'msg'   => $this->localizationService->getMessage('importFieldAccountTypeError'),
                'extra' => null
            );
            $row['AccountType'] .= ';' . $this->localizationService->getMessage('importFieldAccountTypeError');
        }

        // Check the Integration Package Name in DB
        if (is_null($integrationPackageId)) {
            $errors[] = array(
                'field' => 'integrationPackageName',
                'msg'   => $this->localizationService->getMessage('importFieldIntegrationPackageNameError'),
                'extra' => null
            );
            $row['IntegrationPackageName'] .= ';' . $this->localizationService->getMessage('importFieldIntegrationPackageNameError');

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
        if (count($errors)) {
            $row['validation_status'] = 'invalid';
            $row['validation_errors'] = $errors;
        } else {
            $row['validation_status'] = 'valid';
            $row['validation_errors'] = '';
        }
    }

}
