<?php
namespace NP\core\db;

/**
 * This abstracts out a DELETE SQL statement
 *
 * @author Thomas Messier
 */
class Delete extends AbstractFilterableSql implements SQLInterface, SQLElement {
	/**
	 * @var string The table to delete from
	 */
	protected $table = null;

	/**
	 * @param $table  string                        Name of the table to delete from (optional)
	 * @param $where  string|array|NP\core\db\Where The delete criteria
	 */
	public function __construct($table=null, $where=null) {
		// If table was passed, set it
		if ($table !== null) {
			$this->table($table);
		}
		// If criteria was passed, set it
		if ($where !== null) {
			$this->where($where);
		}
	}

	/**
	 * Sets the table to delete from
	 *
	 * @param  $table string     Table to delete from
	 * @param \NP\core\db\Delete Return caller object for easy chaining
	 */
	public function from($table) {
		$this->table = $table;
		return $this;
	}

	/**
	 * @return string Return SQL string for the delete statement
	 */
	public function toString() {
		$sql = "DELETE FROM {$this->table}";
		if ($this->where !== null) {
			$sql .= " WHERE {$this->where->toString()}";
		}
		return $sql;
	}
}
?>