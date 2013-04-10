<?php
namespace NP\core\validation;

/**
 * A class to validate entities
 * 
 * @author Thomas Messier
 */
class EntityValidator implements ValidatorInterface {
	
	/**
	 * @var array An array of errors
	 */
	protected $errors;

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
	public function addError($field, $msg, $extra=null) {
		$this->errors[] = array('field'=>$field, 'msg'=>$msg, 'extra'=>$extra);
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
	 * Validates an entity object
	 *
	 * @param  NP\core\AbstractEntity $dataSet The entity to validate
	 * @return boolean                 If data set is valid, returns true
	 */
	public function validate(\NP\core\AbstractEntity $entity) {
		// Reset the errors array
		$this->errors = array();

		// Get the entity field values as an array
		$dataSet = $entity->toArray();

		// Get the field definition
		$fields = $entity->getFields();

		// Loop through the rules
		foreach ($fields as $field=>$definition) {
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
					$this->addError($field, "This field is required.");
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
	 * Utility function for creating a validator
	 *
	 * @param  string $validatorClass            The entity to validate
	 * @param  array  $options                   The entity to validate
	 * @param  string $displayName               The entity to validate
	 * @return Zend\Validator\AbstractValidator
	 */
	protected function createValidator($validatorClass, $options, $displayName) {
		$options['fieldName'] = $displayName;
		// Check if there are backslashes in $validatorClass; if not, it's not an absolute classpath
		if (strpos($validatorClass, '\\') === false) {
			$validatorPaths = array('NP\core\validation','Zend\Validator','Zend\I18n\Validator');
			$found = false;
			foreach($validatorPaths as $path) {
				$classPath = "\\{$path}\\" . ucfirst($validatorClass);
				if (class_exists($classPath)) {
					$found = true;
					break;
				}
			}
			if (!$found) {
				throw new \NP\core\Exception("Invalid validator \"{$validatorClass}\". It does not exist in any of the following paths: " . implode(', ', $validatorPaths));
			}
		// If there are backslashes it's an absolute classpath so we're pointing to a custom class somewhere
		} else {
			$classPath = $validatorClass;
		}

		// Instantiate and return the class
		return new $classPath($options);
	}
}
?>