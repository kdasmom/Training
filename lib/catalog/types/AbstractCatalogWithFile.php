<?php

namespace NP\catalog\types;

use NP\system\ConfigService;
use NP\core\validation\EntityValidator;

/**
 * Abstract catalog implementation for catalogs that take a file upload
 *
 * @author Thomas Messier
 */
abstract class AbstractCatalogWithFile extends AbstractCatalog {

	public function isValid() {
		parent::isValid();

		if ($this->data['vc_vendors'] === null || count($this->data['vc_vendors']) == 0) {
			$this->validator->addError($this->errors, 'vc_vendors', 'requiredFieldError');
		}

		return (count($this->errors)) ? false : true;
	}

}