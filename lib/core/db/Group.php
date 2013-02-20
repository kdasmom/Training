<?php
namespace NP\core\db;

class Group implements SQLElement {
	/**
	 * @var string|array
	 */
	protected $group;

	public function __construct($group) {
		$this->group = $group;
	}

	public function toString() {
		if (is_string($this->group)) {
			return $this->group;
		} else {
			return implode(',', $this->group);
		}
	}
}
?>