<?php
namespace NP\core\validation;

use Zend\Validator\ValidatorChain;

/**
 * A class to validate data sets
 *
 * This class validates a data set by using the rules defined in its $rules class property
 * (to be overriden in implementations) to determine the type of validation needed.
 * 
 * @abstract
 * @author Thomas Messier
 */
class AbstractValidator implements ValidatorInterface {
	
	/**
	 * Definition of rules
	 * 
	 * This variable MUST be overridden by the extending class. Each array value represents a field of
	 * the data set and can be either a string (if the field has no additional specifications) or an array
	 * with the specifications for the field. The valid options for the array representing a single field
	 * definition are "required", "displayName", and "validation".
	 * 
	 * - required (boolean): if the field is required or not (optional); defaults to false
	 * - displayName (string): a friendly display value that the validator can use to generate error messages (optional); default will be field name if not provided
	 * - validation (array): an associative array where the key is a valid validation rule name (rules in NP\core\validation) and the value is an array with the options for that validation rule
	 * 
	 * @abstract
	 * @var array
	 */
	protected $rules = array();

	/**
	 * @var array An array of errors
	 */
	protected $errors;

	/**
	 * Validates an entity object
	 *
	 * @param  array $dataSet The entity to validate
	 * @return boolean        If data set is valid, returns true
	 */
	public function validate($dataSet) {
		// Reset the errors array
		$this->errors = array();

		// Loop through the rules
		foreach ($this->rules as $field=>$definition) {
			// Check if the field has no definition (if it's not an associative array)
			if ( is_string($definition) ) {
   				$field = $definition;
   				$definition = array();
   			}
   			
   			// Get the value of the field we're currently validating
   			$fieldVal = array_key_exists($field, $dataSet) ? $dataSet[$field] : null;

			// If field is blank, check that first because other validations won't be run
			if ($fieldVal === null || $fieldVal === '') {
				// If the field is required, add an error
				if (array_key_exists('required', $definition) && $definition['required']) {
					$this->addError($field, "The field $field is required.");
				}
				// Break out of the loop, validation is done for this field
				continue;
			}

			// Check for validation key in the definition
			if (array_key_exists('validation', $definition)) {
				$displayName = (array_key_exists('displayName', $definition)) ? $definition['displayName'] : $field;

				// Loop through each validation setting
				foreach ($definition['validation'] as $key=>$val) {
					// Check if we're working with a validator or a validator chain
					if (is_numeric($key) && is_array($val)) {
						// Create a validator chain
						$validator = new \Zend\Validator\ValidatorChain();
						// Loop through validations and attach to the chain, adding the true flag to interrupt
						// validation in the chain if one of the validation steps fails
						foreach($val as $validatorClass=>$options) {
							$validator->addValidator($this->createValidator($validatorClass, $options, $displayName), true);
						}
					} else {
						$validator = $this->createValidator($key, $val, $displayName);
					}

					// Run the validator
					$validator->isValid($fieldVal);

					// Append the errors to the result object
					foreach ($validator->getMessages() as $messageId => $message) {
				        $this->addError($field, $message);
				    }
				}
			}
		}

		return $this->isValid();
	}

	/**
	 * Checks the state of the validator since validate() was last run
	 *
	 * @return boolean Returns true if the data set last validated is valid
	 */
	public function isValid() {
		return (count($this->errors) == 0) ? true : false;
	}

	/**
	 * Add an error
	 *
	 * @param string The field for which the error occurred
	 * @param string The error message
	 */
	public function addError($field, $msg) {
		$this->errors[] = array('field'=>$field, 'msg'=>$msg);
	}

	/**
	 * Gets errors generated when validation was last run
	 *
	 * @return array
	 */
	public function getErrors() {
		return $this->errors;
	}

	/**
	 * Utility function for creating a validator
	 *
	 * @param  string $validatorClass            The entity to validate
	 * @param  array  $options                   The entity to validate
	 * @param  string $displayName               The entity to validate
	 * @return Zend\Validator\AbstractValidator
	 */
	protected function createValidator($validatorClass, $options, $displayName) {
		$options['fieldName'] = $displayName;
		$validatorClass = '\\NP\\core\\validation\\' . ucfirst($validatorClass);
		return new $validatorClass($options);
	}
}
?>