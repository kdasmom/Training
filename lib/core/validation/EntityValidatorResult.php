<?php
namespace NP\core\validation;

class EntityValidatorResult {
	protected $success = true;
	protected $errors = array();
	
	public function addError($field, $error) {
		$this->errors[] = array('field' => $field, 'msg' => $error);
		$this->success = false;
	}

	public function isValid() {
		return $this->success;
	}

	public function getErrors() {
		return $this->errors;
	}

}
?>