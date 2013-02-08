<?php
namespace NP\core\validation;

class EntityValidatorResult {
	protected $errors = array();
	
	public function addError($field, $error) {
		$this->errors[] = array('field' => $field, 'msg' => $error);
	}

	public function isValid() {
		return (count($this->errors)) ? false : true;
	}

	public function getErrors() {
		return $this->errors;
	}

}
?>