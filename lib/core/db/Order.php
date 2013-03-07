<?php
namespace NP\core\db;

/**
 * This abstracts out an ORDER BY clause for a SQL statement
 *
 * @author Thomas Messier
 */
class Order implements SQLElement {
	/**
	 * @var string|array
	 */
	protected $order;

	/**
	 * @param string|array $order
	 */
	public function __construct($order) {
		$this->order = $order;
	}

	/**
	 * @return string String representation of the order clause in a SQL statement
	 */
	public function toString() {
		if (is_string($this->order)) {
			return $this->order;
		} else {
			return implode(',', $this->order);
		}
	}
}
?>