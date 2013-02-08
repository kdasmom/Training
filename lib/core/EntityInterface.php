<?php
namespace NP\core;

interface EntityInterface {
	public function __construct($fields=array());
	public function __set($name, $value);
	public function __get($name);
	public function __isset($name);
	public function __unset($name);
	public function getFields();
	public function toArray();
}

?>