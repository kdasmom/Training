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
    protected function validate(\ArrayObject $row, \ArrayObject $errors)
    {
        // TODO
        if (is_null(null)) {
            $this->addLocalizedErrorMessage('accountType', 'importFieldAccountTypeError');
            $row['AccountType'] .= ';' . $this->translate('importFieldAccountTypeError');
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
