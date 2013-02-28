<?php
namespace NP\core\db;

/**
 * Abstracts a SQL expression to a class
 *
 * @author Thomas Messier
 */
class Expression implements SQLElement {
	/**
	 * @var string|int|float
	 */
	protected $sql = null;

	/**
	 * @param $sql string|int|float The expression can be a string or number
	 */
	public function __construct($sql) {
		if (!is_string($sql) && !is_numeric($sql)) {
			throw new \NP\core\Exception('$sql argument must be a string');
		}
		$this->sql = $sql;
	}

	/**
	 * Return the Expression as a string
	 *
	 * @return string
	 */
	public function toString() {
		return $this->sql."";
	}
}
?>