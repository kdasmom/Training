<?php
namespace NP\core\validation;

use NP\core\EntityInterface;

use Zend\Validator\ValidatorChain;

class EntityValidator implements EntityValidatorInterface {
	
	public function validate(EntityInterface $entity) {
		$result = new EntityValidatorResult();

		// Get the field definitions for the entity
		$fields = $entity->getFields();

		// Loop through the fields
		foreach ($fields as $field=>$definition) {
			// Check if the field has no definition (if it's not an associative array)
			if ( is_string($definition) ) {
   				$field = $definition;
   				$definition = array();
   			}
   			
   			// Get the value of the field we're currently validating
			$fieldVal = $entity->$field;

			// If field is blank, check that first because other validations won't be run
			if ($fieldVal === null || $fieldVal === '') {
				// If the field is required, add an error
				if (array_key_exists('required', $definition) && $definition['required']) {
					$result->addError($field, "The field $field is required.");
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
				        $result->addError($field, $message);
				    }
				}
			}
		}

		return $result;
	}

	protected function createValidator($validatorClass, $options, $displayName) {
		$options['fieldName'] = $displayName;
		$validatorClass = '\\NP\\core\\validation\\' . ucfirst($validatorClass);
		return new $validatorClass($options);
	}
}
?>