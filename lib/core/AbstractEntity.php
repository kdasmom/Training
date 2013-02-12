<?php

namespace NP\core;

/**
 * This is an abstract class that must be extended by all entities in the system.
 *
 * AbstractEntity uses a number of conventions to intialize and provide utility functions
 * for entities.
 * 
 * @abstract
 * @author Thomas Messier
 */
abstract class AbstractEntity implements EntityInterface {
	 
	 /**
	  * Definition of fields for the entity
	  * 
	  * This variable MUST be overridden by the extending class. Each array value represents a property of
	  * the entity and can be either a string (if the field has no additional specifications) or an array
	  * with the specifications for the field. The valid options for the array representing a single field
	  * definition are "required", "default", "displayName", "serializable", "settable", and "validation".
	  * 
	  * - required (boolean): if the field is required or not (optional); defaults to false
	  * - default (mixed): a default value for the field when the entity is instantiated (optional); defaults to null
	  * - displayName (string): a friendly display value that the validator can use to generate error messages (optional); default will be field name if not provided
	  * - serializable (boolean): if this field should be included in the results of toArray() (optional); defaults to true
	  * - settable (boolean): if the field can be manually set by the instantiated class (optional); defaults to true
	  * - validation (array): an associative array where the key is a valid validation rule name (rules in NP\core\validation) and the value is an array with the options for that validation rule
	  * 
	  * @abstract
	  * @var array
	  */
	 protected $fields = array();

	 /**
	  * Holds the actual values for the entity.
	  * 
	  * This field should not be overridden and automatically gets set to a blank array at the beginning of the constructor.
	  * 
	  * @var array
	  */
	 protected $values;
	 
	 /**
	  * @param array $fields An associative array with field values to initialize the entity with
	  */
	public function __construct($fields=array()) {
		$this->values = array();

   		foreach ($this->fields as $field=>$definition) {
   			if ( is_string($definition) ) {
   				$field = $definition;
   				$definition = array();
   			}
   			$setable = (!array_key_exists('setable', $definition)) ? true : $definition['setable'];
   			
			if (array_key_exists($field, $fields) && $setable) {
				$val = $fields[$field];
				$mutator = 'set' . ucfirst($field);
				if (method_exists($this, $mutator) && is_callable(array($this, $mutator))) {
					$this->$mutator($val);
				} else {
					$this->values[$field] = $val;
				}
			} else if (array_key_exists('default', $definition) && $setable) {
				$this->values[$field] = $definition['default'];
			} else {
				$this->values[$field] = null;
			}
	    }
   	}
   
    /**
     * Assign a value to the specified field 
     * 
     * Sets the value via the corresponding mutator (if it exists); otherwise, assigns the value directly 
     * to the $values array
     * 
     * @param string $name  The name of the entity field to set
     * @param mixed  $value The value to set the entity field to
     */
	public function __set($name, $value) {
		$mutator = 'set' . ucfirst($name);
		if (method_exists($this, $mutator) && is_callable(array($this, $mutator))) {
			$this->$mutator($value);
		} else {
			$this->values[$name] = $value;
		}
	}
   
    /**
     * Get the value of the specified field
     * 
     * Gets the value via the getter if it exists, otherwise uses the $values array
     * 
     * @param string $name The name of the field to get
     */
	public function __get($name) {
		$accessor = 'get' . ucfirst($name);
		if (method_exists($this, $accessor) && is_callable(array($this, $accessor))) {
			return $this->$accessor;
		}
		
		return $this->values[$name];
	}
    
    /**
     * Check if a value has been set for a field in the entity
     * 
     * @param string $name The name of the field to check
     * @return boolean     Returns true if the field is set, false if it isn't
     */
	public function __isset($name) {
		return isset($this->values[$name]);
	}

    /**
     * Unset the specified field from the entity
     * 
     * @param string $name The name of the field to unset
     */
	public function __unset($name) {
		if (isset($this->values[$name])) {
			unset($this->values[$name]);
		}
		throw new Exception("The field '$name' has not been set for this entity yet.");
	}

	/**
	 * Returns the field definitions for this entity
	 * 
	 * @return array The array containing the definitions for all the entity's fields
	 */
	public function getFields() {
		return $this->fields;
	}

    /**
     * Get an associative array with the values assigned to the fields of the entity
     * 
     * This will only return as part of the array fields that are serializable
     *
     * @return array The associative array of serializable field values
     */
	public function toArray() {
		$values = array();
		foreach ($this->fields as $field=>$definition) {
			if ( is_string($definition) ) {
   				$field = $definition;
   				$definition = array();
   			}
			if (!array_key_exists('serializable', $definition) || $definition['serializable']) {
				$values[$field] = $this->$field;
			}
		}

		return $values;
	}
	
}