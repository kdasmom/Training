<?php
namespace NP\core\db;

/**
 * This abstracts out JOIN clause for a SQL statement
 *
 * @author Thomas Messier
 */
class Join implements SQLElement {
	/**
	 * @var array
	 */
	protected $table, $condition, $cols, $type;

	/**
	 * @param 
	 */
	public function __construct($table=null, $condition=null, $cols=null, $type=Select::JOIN_INNER) {
		$this->setTable($table);
		$this->setCondition($condition);
		$this->setCols($cols);
		$this->setType($type);
	}

	public function getTable() {
		return $this->table;
	}

	public function setTable($table) {
		if ($table !== null && !$table instanceOf Table) {
			$table = new Table($table);
		}
		$this->table = $table;

		return $this;
	}

	public function getCondition() {
		return $this->condition;
	}

	public function setCondition($condition) {
		$this->condition = $condition;

		return $this;
	}

	public function getCols() {
		return $this->cols;
	}

	public function setCols($cols) {
		$this->cols = $cols;

		return $this;
	}

	public function getType() {
		return $this->type;
	}

	public function setType($type) {
		$this->type = strtoupper($type);

		return $this;
	}

	/**
	 * @return string String representation of the JOIN clause in a SQL statement
	 */
	public function toString() {
		if ($this->table === null) {
			throw new \NP\core\Exception('$table cannot be null');
		}

		$validTypes = array(Select::JOIN_INNER, Select::JOIN_LEFT, Select::JOIN_RIGHT, Select::JOIN_CROSS, Select::JOIN_LEFT_OUTER);
		if (!in_array($this->type, $validTypes)) {
			throw new \NP\core\Exception('Invalid $values argument. Valid values are ' . implode(',', $validTypes));
		}
		if ($this->type !== Select::JOIN_CROSS && $this->condition === null) {
			throw new \NP\core\Exception('$condition can only be null when the join is a CROSS join');
		}

		$sql = "{$this->type} JOIN {$this->table->toString()}";

		// Add the table join condition if there is one
		if (strtoupper($this->type) != 'CROSS') {
			$sql .= " ON {$this->condition}";
		}

		return $sql;
	}
}
?>