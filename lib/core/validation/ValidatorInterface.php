<?php
namespace NP\core\validation;

/**
 * @author Thomas Messier
 */
interface ValidatorInterface {
	
	/**
	 * Validates a data set
	 *
	 * @param  NP\core\AbstractEntity $entity The entity to validate
	 * @return boolean                        Whether validation successed or not
	 */
	public function validate(\NP\core\AbstractEntity $entity);

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
	 * @param mixed  Any extra info you want to include in the error
	 */
	public function addError($field, $msg, $extra=null);

	/**
	 * Gets errors generated when validation was last run
	 *
	 * @return array
	 */
	public function getErrors();
}
?>