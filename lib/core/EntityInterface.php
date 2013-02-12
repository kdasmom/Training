<?php
namespace NP\core;

/**
 * @author Thomas Messier
 */
interface EntityInterface {

	/**
	  * @param array $fields An associative array with field values to initialize the entity with
	  */
	public function __construct($fields=array());
	
	/**
     * Assign a value to the specified field 
     * 
     * Sets the value via the corresponding mutator (if it exists); otherwise, assigns the value directly 
     * to the $values array
     * 
     * @param string $name  The name of the entity field to set
     * @param mixed  $value The value to set the entity field to
     */
	public function __set($name, $value);
	
	/**
     * Get the value of the specified field
     * 
     * Gets the value via the getter if it exists, otherwise uses the $values array
     * 
     * @param string $name The name of the field to get
     */
	public function __get($name);
	
	/**
     * Check if a value has been set for a field in the entity
     * 
     * @param string $name The name of the field to check
     * @return boolean     Returns true if the field is set, false if it isn't
     */
	public function __isset($name);
	
	/**
     * Unset the specified field from the entity
     * 
     * @param string $name The name of the field to unset
     */
	public function __unset($name);
	
	/**
	 * Returns the field definitions for this entity
	 * 
	 * @return array The array containing the definitions for all the entity's fields
	 */
	public function getFields();
	
	/**
     * Get an associative array with the values assigned to the fields of the entity
     * 
     * This will only return as part of the array fields that are serializable
     *
     * @return array The associative array of serializable field values
     */
	public function toArray();
}

?>