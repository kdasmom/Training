<?php
namespace NP\core\db;

/**
 * This abstracts out an INSERT SQL statement
 *
 * @author Thomas Messier
 */
class Insert implements SQLInterface, SQLElement {
	/**
	 * @var string The table to insert into
	 */
	protected $table = null;

	/**
	 * @var array An associative array of values to insert
	 */
	protected $values = array();

	/**
	 * @var array Columns to insert; this is only used when using a Select object for $values
	 */
	protected $cols = null;

	/**
	 * @param $table  string Name of the table to insert into (optional)
	 * @param $values array  Values to insert (optional)
	 */
	public function __construct($table=null, $values=null) {
		// If table was passed, set it
		if ($table !== null) {
			$this->into($table);
		}
		// If values were passed, set them
		if ($values !== null) {
			$this->values($values);
		}
	}

	/**
	 * Sets the table to insert into
	 *
	 * @param  $table string      Table to isert into
	 * @return \NP\core\db\Insert Return caller object for easy chaining
	 */
	public function into($table) {
		$this->table = $table;
		return $this;
	}

	/**
	 * Adds columns to be inserted into; this is only relevant when $values is set to a Select object
	 *
	 * @param  $cols array        An array of columns; see the column($col) method for valid column definitions
	 * @return \NP\core\db\Insert Caller object returned for easy chaining
	 */
	public function columns($cols) {
		$this->cols = $cols;
		return $this;
	}

	/**
	 * Adds a set of values to be inserted
	 *
	 * @param  $values array|\NP\core\db\Select Values to insert in the table
	 * @return \NP\core\db\Insert               Return caller object for easy chaining
	 */
	public function values($values) {
		$this->values = $values;
		return $this;
	}

	/**
	 * Adds a column value to be inserted
	 *
	 * @param  $col   string        Column to insert in the table
	 * @param  $value number|string Value of the column to insert in the table
	 * @return \NP\core\db\Insert   Return caller object for easy chaining
	 */
	public function value($col, $value) {
		$this->values[$col] = $value;
		return $this;
	}

	/**
	 * @return string Return SQL string for the insert statement
	 */
	public function toString() {
		if (is_array($this->values)) {
			$cols = array_keys($this->values);
			$values = array_values($this->values);
			$sqlCols = implode(',', $cols);
			$sqlValues = implode(',', $values);
			return "INSERT INTO {$this->table} ({$sqlCols}) VALUES ({$sqlValues})";
		} else if ($this->values instanceOf Select) {
			$sqlCols = implode(',', $this->cols);
			return "INSERT INTO {$this->table} ({$sqlCols}) {$this->values->toString()}";
		}
	}
}
?>