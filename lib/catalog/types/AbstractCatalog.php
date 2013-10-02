<?php

namespace NP\catalog\types;

use NP\system\ConfigService;
use NP\locale\LocalizationService;
use NP\core\validation\EntityValidator;

/**
 * Abstract catalog implementation
 *
 * @author Thomas Messier
 */
abstract class AbstractCatalog {

	protected static $assignmentFields = array('categories','vendors','properties');

	protected $configService;
	protected $vc;
	protected $data;
	protected $validator;
	protected $errors;

	public function __construct(ConfigService $configService, EntityValidator $entityValidator, $vc, $data) {
		$this->configService       = $configService;
		$this->validator           = $entityValidator;
		$this->vc                  = $vc;
		$this->data                = $data;
		$this->errors              = array();
	}

	abstract public function getAssignmentFields();

	public function isValid() {
		$this->errors = $this->validator->validate($this->vc);
		
		foreach (self::$assignmentFields as $val) {
			if ( in_array($val, $this->getAssignmentFields()) ) {
				if ($this->data["vc_{$val}"] === null || count($this->data["vc_{$val}"]) == 0) {
					$this->validator->addError($this->errors, "vc_{$val}", 'requiredFieldError');
				}
			}
		}

		return (count($this->errors)) ? false : true;
	}

	public function getErrors() {
		return $this->errors;
	}

	public function beforeSave() { return array(); }

	public function afterSave() { return array(); }

}