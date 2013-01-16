<?php

namespace NP\util;

class Util {
	
	public static function formatDateForDB($timestamp) {
		return date("Y-m-d G:i:s", $timestamp);
	}
	
	public static function isAssocArray($arr) {
		return array_keys($arr) !== range(0, count($arr) - 1);
	}
	
}

?>