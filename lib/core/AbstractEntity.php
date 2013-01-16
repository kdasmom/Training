<?php

namespace NP\core;

abstract class AbstractEntity {
	 
	 protected $originalValues;
	 
	 public function __construct($fields=array()) {
   		foreach ($this->fields as $key=>$defaultVal) {
			if (array_key_exists($key, $fields)) {
				$val = $fields[$key];
				$mutator = 'set' . ucfirst($key);
				if (method_exists($this, $mutator) && is_callable(array($this, $mutator))) {
					$this->$mutator($val);
				} else {
					$this->fields[$key] = $val;
				}
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
			$this->fields[$name] = $value;
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
		
		return $this->fields[$name];   
	}
    
    /**
     * Check if the specified field has been assigned to the entity
     */
	public function __isset($name) {
		return isset($this->fields[$name]);
	}

    /**
     * Unset the specified field from the entity
     */
	public function __unset($name) {
		if (isset($this->fields[$name])) {
			unset($this->fields[$name]);
			return true;
		}
		throw new Exception("The field '$name' has not been set for this entity yet.");
	}
	
	public function getClassName() {
		return get_called_class();
	}

    /**
     * Get an associative array with the values assigned to the fields of the entity
     */
	public function toArray() {
		return $this->fields;
	}
	
}