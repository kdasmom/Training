<?php

namespace NP\core;

abstract class AbstractEntity {
	 
	 protected $values;
	 
	 public function __construct($fields=array()) {
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
     * Assign a value to the specified field via the corresponding mutator (if it exists);
     * otherwise, assign the value directly to the '$values' array
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
     * Get the value of the specified field (via the getter if it exists or by getting it from the $values array)
     */
	public function __get($name) {
		$accessor = 'get' . ucfirst($name);
		if (method_exists($this, $accessor) && is_callable(array($this, $accessor))) {
			return $this->$accessor;
		}
		
		return $this->values[$name];
	}
    
    /**
     * Check if the specified field has been assigned to the entity
     */
	public function __isset($name) {
		return isset($this->values[$name]);
	}

    /**
     * Unset the specified field from the entity
     */
	public function __unset($name) {
		if (isset($this->values[$name])) {
			unset($this->values[$name]);
			return true;
		}
		throw new Exception("The field '$name' has not been set for this entity yet.");
	}
	
	public function getClassName() {
		return get_called_class();
	}

	public function getFields() {
		return $this->fields;
	}

    /**
     * Get an associative array with the values assigned to the fields of the entity
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