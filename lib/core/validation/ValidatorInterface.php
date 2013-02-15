<?php
namespace NP\core\validation;

/**
 * @author Thomas Messier
 */
interface ValidatorInterface {
	
	/**
	 * Validates a data set
	 *
	 * @param  array $dataSet                           The data set to validate
	 * @return NP\core\validation\EntityValidatorResult An object containing the result of the validation
	 */
	public function validate($dataSet);

	/**
	 * Checks the state of the validator since validate() was last run
	 *
	 * @return boolean Returns true if the data set last validated is valid
	 */
	public function isValid();

	/**
	 * Add an error
	 *
	 * @param string The field for which the error occurred
	 * @param string The error message
	 */
	public function addError($field, $msg);

	/**
	 * Gets errors generated when validation was last run
	 *
	 * @return array
	 */
	public function getErrors();
}
?>