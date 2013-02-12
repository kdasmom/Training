<?php
namespace NP\core\validation;

/**
 * Represents the result of an entity validation operation
 * 
 * @author Thomas Messier
 */
class EntityValidatorResult {
	/**
	 * An array that keeps tracks of the errors that came as the result of a validation
	 *
	 * @var array
	 */
	protected $errors = array();
	
	/**
	 * Adds an error to the collection
	 *
	 * @param string $field The field that failed validation
	 * @param string $msg   The error message
	 */
	public function addError($field, $error) {
		$this->errors[] = array('field' => $field, 'msg' => $error);
	}

	/**
	 * If the validation was successful or not
	 *
	 * @return boolean
	 */
	public function isValid() {
		return (count($this->errors)) ? false : true;
	}

	/**
	 * Returns all errors for a validation
	 *
	 * @return array
	 */
	public function getErrors() {
		return $this->errors;
	}

}
?>