<?php
namespace NP\core\db;

/**
 * This abstracts out an UPDATE SQL statement
 *
 * @author Thomas Messier
 */
class Update extends AbstractFilterableSql implements SQLInterface, SQLElement {
	/**
	 * @var string The table to update
	 */
	protected $table = null;

	/**
	 * @var array An associative array of values to update
	 */
	protected $values = array();

	/**
	 * Static function to retrieve an Update object (to avoid having to use $update = new Update() all the time)
	 * @return \NP\core\db\Update
	 */
	public static function get() {
		return new Update();
	}

	/**
	 * @param $table  string                        Name of the table to update into (optional)
	 * @param $values array                         Values to update (optional)
	 * @param $where  string|array|NP\core\db\Where The update criteria
	 */
	public function __construct($table=null, $values=null, $where=null) {
		// If table was passed, set it
		if ($table !== null) {
			$this->table($table);
		}
		// If values were passed, set them
		if ($values !== null) {
			$this->values($values);
		}
		// If criteria was passed, set it
		if ($where !== null) {
			$this->where($where);
		}
	}

	/**
	 * Sets the table to update into
	 *
	 * @param  $table string     Table to isert into
	 * @param \NP\core\db\Update Return caller object for easy chaining
	 */
	public function table($table) {
		$this->table = $table;
		return $this;
	}

	/**
	 * Adds a set of values to be updated
	 *
	 * @param $values array      Values to update in the table
	 * @param \NP\core\db\Update Return caller object for easy chaining
	 */
	public function values($values) {
		$this->values = $values;
		return $this;
	}

	/**
	 * Adds a column value to be updated
	 *
	 * @param $col   string        Column to update in the table
	 * @param $value number|string Value of the column to update in the table
	 * @param \NP\core\db\Update   Return caller object for easy chaining
	 */
	public function value($col, $value) {
		$this->values[$col] = $value;
		return $this;
	}

	/**
	 * @return string Return SQL string for the update statement
	 */
	public function toString() {
		$cols = array_keys($this->values);
		$values = array_values($this->values);
		$colValues = array();
		for ($i=0; $i<count($cols); $i++) {
			$colValues[] = "{$cols[$i]} = {$values[$i]}";
		}
		$colValues = implode(',', $colValues);
		$sql = "UPDATE {$this->table} SET {$colValues}";
		if ($this->where !== null) {
			$sql .= " WHERE {$this->where->toString()}";
		}
		return $sql;
	}
}
?>