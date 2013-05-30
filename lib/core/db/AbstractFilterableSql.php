<?php
namespace NP\core\db;

/**
 * Abstracts object that represents a SQL object that can have a where clause (Select, Update, and Delete)
 *
 * @author Thomas Messier
 */
abstract class AbstractFilterableSql {
	/**
	 * @var \NP\core\db\Where WHERE clause for the SELECT statement
	 */
	protected $where = null;

	/**
	 * Adds a WHERE clause to the statement
	 *
	 * @param  $where string|array|NP\core\db\Where
	 * @return \NP\core\db\Select                   Caller object returned for easy chaining
	 */
	public function where($where) {
		if (!is_string($where) && !is_array($where) && !$where instanceOf Where) {
			throw new \NP\core\Exception('The $where argument must be a string, array, or NP\core\db\Where object');
		}
		if (!$where instanceOf Where) {
			$where = new Where($where);
		}
		$this->where = $where;

		return $this;
	}

	/**
	 * Magic method to call different Where object methods directly from the Select object.
	 * Just call a method named "where" followed by an operation method from the Where object.
	 * For example, you can do things like $select->whereIsNotNull('col_name') or
	 * $select->whereLessThanOrEqual('col_name', 20)
	 *
	 * @param  $name      string  Name of the method to call; valid values are "AND" or "OR"
	 * @param  $arguments array   Arguments passed to the method
	 * @return \NP\core\db\Select Caller object returned for easy chaining
	 */
	public function __call($name, $arguments) {
		if (strpos($name, 'where') === false) {
			throw new \NP\core\Exception('The only magic functions supported must start with "where"');
		}

		if ($this->where === null) {
			$this->where = new Where();
		}

		$operator = str_replace('where', '', $name);
		$operator = lcfirst($operator);
		if (count($arguments) == 0) {
			$this->where->{$operator}();
		} else if (count($arguments) == 1) {
			$this->where->{$operator}($arguments[0]);
		} else if (count($arguments) == 2) {
			$this->where->{$operator}($arguments[0], $arguments[1]);
		} else if (count($arguments) == 3) {
			$this->where->{$operator}($arguments[0], $arguments[1], $arguments[2]);
		}

        return $this;
    }
}

?>