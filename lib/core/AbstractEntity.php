<?php
namespace NP\core;

abstract class AbstractEntity {
	
	/**
	 * Definition of fields
	 * 
	 * This variable MUST be overridden by the extending class. Each array value represents a field of
	 * the entity and can be either just a value with the field name (if the field has no additional specifications)
	 *  or a key/value pair where the key is the field name and the value is another array with the specifications 
	 * for the field. The valid options for the array representing a single field definition are "required", 
	 * "displayName", and "validation".
	 * 
	 * - required (boolean): if the field is required or not (optional); defaults to false
	 * - displayName (string): a friendly display value that the validator can use to generate error messages (optional); default will be field name if not provided
	 * - validation (array): an associative array where the key is a valid validation rule name (rules in NP\core\validation) and the value is an array with the options for that validation rule
	 * 
	 * @abstract
	 * @var array
	 */
	protected $fields;

	/**
	 * @var array Associative array holding the values for each field of this entity
	 */
	protected $values = array();

	/**
	 * @param array $data An associative array of data for the entity
	 */
	public function __construct($data) {
		if ($this->fields === null) {
			throw new \NP\core\Exception("You must define fields for the entity in the \$fields property.");
		}
		foreach($this->fields as $field=>$definition) {
			if (array_key_exists($field, $data)) {
				$this->values[$field] = $data[$field];
			} else {
				if (array_key_exists('defaultValue', $definition))  {
					$this->values[$field] = $definition['defaultValue'];
				} else {
					$this->values[$field] = null;
				}
			}
		}
	}

	/**
	 * Returns the field definitions
	 */
	public function getFields() {
		return $this->fields;
	}

	/**
	 * Getter for fields
	 *
	 * @param  string $field The name of the field to retrieve
	 * @return mixed         The value of the field
	 */
	public function __get($field) {
		if (!array_key_exists($field, $this->fields)) {
			throw new \NP\core\Exception("The field {$field} is not defined for this object.");
		}
		$accessor = 'get' . ucfirst($field);
		if (method_exists($this, $accessor)) {
			return $this->$accessor();
		} else {
			return $this->values[$field];
		}
	}

	/**
	 * Setter for fields
	 *
	 * @param string $field The name of the field to retrieve
	 * @param mixed  $val   The value to set the field to
	 */
	public function __set($field, $val) {
		if (!array_key_exists($field, $this->fields)) {
			throw new \NP\core\Exception("The field {$field} is not defined for this object.");
		}
		$mutator = 'set' . ucfirst($field);
		if (method_exists($this, $mutator)) {
			$this->$mutator($val);
		} else {
			$this->values[$field] = $val;
		}
	}

	/**
	 * @return array Associative array with entity field values
	 */
	public function toArray() {
		return $this->values;
	}

}
?>