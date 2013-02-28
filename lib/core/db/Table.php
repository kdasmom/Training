<?php
namespace NP\core\db;

class Table implements SQLElement {
	/**
	 * @var string|array
	 */
	protected $table;

	/**
	 * @var string
	 */
	protected $columnPrefix;

	/**
	 * @param string|array A table name as a string or array in the format array(alias=>table); the table can also be a Select object to use a subquery
	 */
	public function __construct($table) {
		if (!is_string($table) && !is_array($table)) {
			throw new \NP\core\Exception('The $table argument must be a string or associative array in the format array(alias=>table)');
		} else if (is_array($table)) {
			$this->columnPrefix = key($table);
			$tableName = current($table);
			if (!is_string($this->columnPrefix) || (!is_string($tableName) && !$tableName instanceOf Select)) {
				throw new \NP\core\Exception('The $table associative array must be in the format array(alias=>table) where alias is a string and table is either a string or Select object');
			}
		} else {
			$this->columnPrefix = $table;
		}
		$this->table = $table;
	}

	/**
	 * Returns a string representation of the Table object
	 *
	 * @return string
	 */
	public function toString() {
		if (is_string($this->table)) {
			return $this->table;
		} else if (is_array($this->table)) {
			$alias = key($this->table);
			$table = current($this->table);
			if ($table instanceOf Select) {
				return "({$table->toString()}) AS {$alias}";
			} else {
				return "{$table} {$alias}";
			}
		}
	}

	/**
	 * Returns the prefix to use for columns of this table
	 *
	 * @return string
	 */
	public function getColumnPrefix() {
		return $this->columnPrefix;
	}
}
?>