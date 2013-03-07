<?php
namespace NP\core\db;

/**
 * This abstracts out a GROUP BY clause for a SQL statement
 *
 * @author Thomas Messier
 */
class Group implements SQLElement {
	/**
	 * @var string|array
	 */
	protected $group;

	/**
	 * @var string|array
	 */
	public function __construct($group) {
		$this->group = $group;
	}

	/**
	 * @return string String representation of the group clause in a SQL statement
	 */
	public function toString() {
		if (is_string($this->group)) {
			return $this->group;
		} else {
			return implode(',', $this->group);
		}
	}
}
?>