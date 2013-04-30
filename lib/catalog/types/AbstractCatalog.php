<?php

namespace NP\catalog\types;

use NP\system\ConfigService;
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

	public function __construct(ConfigService $configService, $vc, $data) {
		$this->configService = $configService;
		$this->vc            = $vc;
		$this->data          = $data;
		$this->validator     = new EntityValidator();
	}

	abstract protected function getAssignmentFields();

	public function isValid() {
		$this->validator->validate($this->vc);
		
		foreach (self::$assignmentFields as $val) {
			if ( in_array($val, $this->getAssignmentFields()) ) {
				if ($this->data["vc_{$val}"] === null || count($this->data["vc_{$val}"]) == 0) {
					$this->validator->addError("vc_{$val}", 'This field is required');
				}
			}
		}

		return $this->validator->isValid();
	}

	public function getErrors() {
		return $this->validator->getErrors();
	}

	public function beforeSave() { return array(); }

	public function afterSave() { return array(); }

}