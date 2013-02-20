<?php
namespace NP\core\db;

class Order implements SQLElement {
	/**
	 * @var string|array
	 */
	protected $order;

	public function __construct($order) {
		$this->order = $order;
	}

	public function toString() {
		if (is_string($this->order)) {
			return $this->order;
		} else {
			return implode(',', $this->order);
		}
	}
}
?>