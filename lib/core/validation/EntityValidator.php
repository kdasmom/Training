<?php
namespace NP\core\validation;

use NP\locale\LocalizationService;
use NP\core\db\Adapter;
use NP\core\db\Select;


/**
 * A class to validate entities
 * 
 * @author Thomas Messier
 */
class EntityValidator implements ValidatorInterface {
	protected $localizationService, $adapter, $configService;

	public function __construct(LocalizationService $localizationService, Adapter $adapter) {
		$this->localizationService = $localizationService;
		$this->adapter             = $adapter;
	}

	/**
	 * Validates an entity object
	 *
	 * @param  NP\core\AbstractEntity $dataSet The entity to validate
	 * @return array An array of errors
	 */
	public function validate(\NP\core\AbstractEntity $entity) {
		// Reset the errors array
		$errors = array();

		// Get the entity field values as an array
		$dataSet = $entity->toArray();

		// Get the field definition
		$fields = $entity->getFields();

		// Loop through the rules
		foreach ($fields as $field=>$definition) {
			$isValid = true;

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
					$this->addError($errors, $field, 'requiredFieldError');
				}
				// Break out of the loop, validation is done for this field
				continue;
			}

			// Check for validation key in the definition
			if (array_key_exists('validation', $definition)) {
				$displayName = (array_key_exists('displayName', $definition)) ? $definition['displayName'] : $field;
				$displayName = $this->localizationService->getMessage($displayName);
				
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
					if ($isValid) {
						$isValid = $validator->isValid($fieldVal);
					}

					// Append the errors to the result object
					foreach ($validator->getMessages() as $messageId => $message) {
				        $this->addError($errors, $field, $message);
				    }
				}
			}

			// Only do foreign key checks if the object is valid
			if ($isValid && array_key_exists('tableConstraint', $definition)) {
				$contraint = $definition['tableConstraint'];
				$errorMsg  = null;
				$typeField = null;
				$typeValue = null;
				if (is_string($contraint) || empty($contraint)) {
					$tableName = str_replace('_id', '', $field);
					$relationField = $field;
				} else {
					$tableName = $contraint['table'];
					if (array_key_exists('field', $contraint)) {
						$relationField = $contraint['field'];
					} else {
						$relationField = $tableName . '_id';
					}
					if (array_key_exists('typeField', $contraint)) {
						$typeField = $contraint['typeField'];
					}
					if (array_key_exists('typeValue', $contraint)) {
						$typeValue = $contraint['typeValue'];
					}
					if (array_key_exists('errorMsg', $contraint)) {
						$errorMsg = $contraint['errorMsg'];
					}
				}

				$select = new Select();
				$select->from($tableName)
						->whereEquals($relationField, '?');

				if ($typeField !== null) {
					$select->whereEquals($typeField, "'{$typeField}'");
				}

				$res = $this->adapter->query($select, array($fieldVal));

				if (!count($res)) {
					if ($errorMsg === null) {
						$errorMsg = $this->localizationService->getMessage('noRecordFoundError') . " {$fieldVal}";
					}
					$this->addError($errors, $field, $errorMsg);
				}
			}
		}

		return $errors;
	}
	
	/**
	 * Add an error
	 *
	 * @param string The field for which the error occurred
	 * @param string The error message
	 */
	public function addError(&$errors, $field, $msg, $extra=null) {
		array_push(
			$errors,
			array(
				'field' => $field,
				'msg'   => $this->localizationService->getMessage($msg),
				'extra' => $extra
			)
		);
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
