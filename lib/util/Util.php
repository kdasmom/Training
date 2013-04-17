<?php
namespace NP\util;

/**
 * This class provides utility functions that might be needed all over the application
 * 
 * This class is not meant to be instantiated and should have only static functions. 
 */
class Util {
	
	/**
	 * Formats a date in a format that can be used to save to the database and returns it
	 * 
	 * @param  int $timestamp An integer representing time measured in the number of seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)
	 * @return string         A date formatted string
	 */
	public static function formatDateForDB($timestamp=null) {
		if ($timestamp === null) {
			$timestamp = time();
		}
		return date("Y-m-d G:i:s", $timestamp);
	}
	
	/**
	 * Checks if an array is an associative or positional array
	 * 
	 * @param  array $arr An array
	 * @return boolean    Whether or not the array is associative
	 */
	public static function isAssocArray($arr) {
		return array_keys($arr) !== range(0, count($arr) - 1);
	}
	
}

?>