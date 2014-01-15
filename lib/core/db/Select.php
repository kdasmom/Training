<?php
namespace NP\core\db;

use NP\core\db\Expression;

/**
 * Abstracts a SQL SELECT statement to an object
 *
 * @author Thomas Messier
 */
class Select extends AbstractFilterableSql implements SQLInterface, SQLElement {
	const JOIN_INNER = 'INNER';
	const JOIN_LEFT  = 'LEFT';
	const JOIN_RIGHT = 'RIGHT';
	const JOIN_CROSS = 'CROSS';
	const JOIN_LEFT_OUTER  = 'LEFT OUTER';

	/**
	 * @var array Associative array with table alias as key and table name as value
	 */
	protected $table = null;

	/**
	 * @var array Columns to retrieve for the main table
	 */
	protected $cols = null;

	/**
	 * @var boolean Whether to do a COUNT() in the SELECT clause
	 */
	protected $count = false;

	/**
	 * @var string Alias for the count column
	 */
	protected $countAlias = null;
	
	/**
	 * @var boolean Whether to include DISTINCT
	 */
	protected $distinct = false;

	/**
	 * @var array Joins for the SELECT statement
	 */
	protected $joins = array();

	/**
	 * @var array Unions for the select statement
	 */
	protected $unions = array();

	/**
	 * @var \NP\core\db\Group GROUP BY clause for the SELECT statement
	 */
	protected $group = null;

	protected $having = null;

	/**
	 * @var \NP\core\db\Order ORDER BY clause for the SELECT statement
	 */
	protected $order = null;
	
	/**
	 * @var int Maximum number of records to get with this SELECT statement
	 */
	protected $limit = null;
	
	/**
	 * @var int Which row number to start returning records from (first row number is 1)
	 */
	protected $offset = null;

	/**
	 * Static function to retrieve a select object (to avoid having to use new Select() all the time)
	 * @return \NP\core\db\Select
	 */
	public static function get() {
		return new Select();
	}

	/**
	 * @param $table string|array See from($table) method (optional)
	 * @param $cols  array        Columns to retrieve from main table (optional)
	 */
	public function __construct($table=null, $cols=null) {
		if ($table !== null) {
			$this->from($table);
		}
		$this->columns($cols);
		$this->where = new Where();
	}

	/**
	 * Sets the main table for the FROM clause
	 *
	 * @param  $table string|array Main table for FROM clause; can be a string with the table name or an associative array with alias=>tableName; if using an associative array, the value can also be a Select object to use as a subquery
	 * @return \NP\core\db\Select   Caller object returned for easy chaining
	 */
	public function from($table) {
		if (!$table instanceOf Table) {
			$table = new Table($table);
		}
		$this->table = $table;
		return $this;
	}

	/**
	 * Adds a column to the list of columns to be fetched
	 *
	 * @param  $col string|array|NP\core\db\Expression|NP\core\db\Select Can be the name of a column from the main table as a string, an Expression object, or a Select object (subquery); each of these values can also be used as the column portion of an array in the format alias=>column
	 * @return \NP\core\db\Select                                         Caller object returned for easy chaining
	 */
	public function column($col, $alias=null) {
		if ($alias === null) {
			$this->cols[] = $col;
		} else {
			$this->cols[$alias] = $col;
		}
		
		return $this;
	}

	/**
	 * Adds columns to be fetched
	 *
	 * @param  array $cols An array of columns; see the column($col) method for valid column definitions
	 * @return \NP\core\db\Select Caller object returned for easy chaining
	 */
	public function columns($cols) {
		$this->cols = $cols;
		return $this;
	}

	/**
	 * Returns all columns for a table (adds a * to the column list)
	 *
	 * @param string $alias Table alias for the table we want to retrieve all columns from
	 * @return \NP\core\db\Select Caller object returned for easy chaining
	 */
	public function allColumns($alias=null) {
		$expr = '*';
		if ($alias != null) {
			$expr = "{$alias}.{$expr}";
		}
		return $this->column(new Expression($expr));
	}

	/**
	 * Sets if DISTINCT is included or not in the SELECT clause
	 *
	 * @param boolean $distinct
	 * @return \NP\core\db\Select Caller object returned for easy chaining
	 */
	public function distinct($distinct=true) {
		$this->distinct = $distinct;
		return $this;
	}

	/**
	 * Sets if COUNT is included or not in the SELECT clause
	 *
	 * @param boolean $distinct
	 * @param string  $alias    Alias for count()
	 * @return \NP\core\db\Select Caller object returned for easy chaining
	 */
	public function count($count=true, $alias=null) {
		$this->count = $count;
		$this->countAlias = $alias;
		return $this;
	}

	/**
	 * Adds a join to the statement
	 *
	 * @param  $table     string|array Can be the name of a table as a string or an associative array in the format alias=>table; if using array, the table part can be a Select object
	 * @param  $condition string       The join condition
	 * @param  $cols      array        Columns from the join table to fetch
	 * @param  $type      string       Type of join (optional); valid values are INNER, LEFT, and RIGHT; defaults to INNER
	 * @return \NP\core\db\Select Caller object returned for easy chaining
	 */
	public function join($table, $condition=null, $cols=null, $type=self::JOIN_INNER) {
		if (!$table instanceOf Join) {
			$table = new Join($table, $condition, $cols, $type);
		}
		
		$this->joins[] = $table;
		
		return $this;
	}

	/**
	 * Adds a join to the statement
	 *
	 * @param  Select  $select A Select statement to unionize with this one (cannot have an order by, must have same number of columns)
	 * @param  boolean $isAll  Whether or not to do UNION ALL
	 * @return \NP\core\db\Select Caller object returned for easy chaining
	 */
	public function union(Select $select, $isAll=true) {
		$this->unions[] = ['select'=>$select, 'isAll'=>$isAll];
		
		return $this;
	}

	/**
	 * Removes all joins
	 */
	public function resetJoins() {
		$this->joins = array();
	}

	/**
	 * Adds a GROUP BY clause to the statement
	 *
	 * @param $group string|array|NP\core\db\Group
	 * @return \NP\core\db\Select                   Caller object returned for easy chaining
	 */
	public function group($group) {
		if ($group !== null && !$group instanceOf Group) {
			$group = new Group($group);
		}
		$this->group = $group;
		return $this;
	}

	/**
	 * Adds a HAVING clause to the statement
	 *
	 * @param  $where string|array|NP\core\db\Where
	 * @return \NP\core\db\Select                   Caller object returned for easy chaining
	 */
	public function having($having) {
		if (!is_string($having) && !is_array($having) && !$having instanceOf Where) {
			throw new \NP\core\Exception('The $having argument must be a string, array, or NP\core\db\Where object');
		}
		if (!$having instanceOf Where) {
			$having = new Where($having);
		}
		$this->having = $having;

		return $this;
	}

	/**
	 * Adds an ORDER BY clause to the statement
	 *
	 * @param $group string|array|NP\core\db\Order
	 * @return \NP\core\db\Select                   Caller object returned for easy chaining
	 */
	public function order($order) {
		if ($order !== null && !$order instanceOf Order) {
			$order = new Order($order);
		}
		$this->order = $order;
		return $this;
	}

	/**
	 * Makes statement return only a certain number of records
	 *
	 * @param $limit int         The maximum number of records to return
	 * @return \NP\core\db\Select Caller object returned for easy chaining
	 */
	public function limit($limit) {
		$this->limit = $limit;
		return $this;
	}

	/**
	 * Makes statement start returning records starting on a certain row
	 *
	 * @param $offset int        Row to start returning records from
	 * @return \NP\core\db\Select Caller object returned for easy chaining
	 */
	public function offset($offset) {
		$this->offset = $offset;
		return $this;
	}

	/**
	 * Returns certain internal elements of the object in their raw form
	 *
	 * @param  $item string Valid values are "table","cols","joins","where","order","limit","offset","count","distinct", and "group"
	 * @return mixed
	 */
	public function getRawState($item) {
		$validItems = array('table','cols','joins','where','order','limit','offset','count','distinct','group');
		if (!in_array($item, $validItems)) {
			$validDisplay = implode(',', $validItems);
			throw new \NP\core\Exception("Tried to retrieve invalid item. Valid items are {$validDisplay}");
		}
		return $this->$item;
	}

	/**
	 * Returns a string representation of the Select object
	 *
	 * @return string
	 */
	public function toString() {
		// Start building the SQL string
		$sql = 'SELECT ';

		// Do this if count has been set
		if ($this->count) {
			// If count is set, you can only have one column defined ( to do SELECT count(col_name) )
			if (is_array($this->cols) && count($this->cols) > 1) {
				throw new \NP\core\Exception('Select statement using count() can have a maximum of one column from the main table specified');
			}
			// Include the count clause first
			$sql .= "COUNT(";
			// If distinct is also set, means we want to do something like SELECT COUNT(DISTINCT col_name)
			if ($this->distinct) {
				// This requires that one column be set
				if (is_array($this->cols) && count($this->cols) == 0) {
					throw new \NP\core\Exception('Select statement using count() and distinct must include exactly one column from the main table');
				}
				$sql .= "DISTINCT ";
			}
			// If we have a column specified, we need to add it to count()
			if (is_array($this->cols) && count($this->cols)) {
				$firstCol = $this->cols[0];
				// Check if we're dealing with an expression or a string
				if ($firstCol instanceOf Expression) {
					$sql .= $firstCol->toString();
				} else {
					$sql .= "{$this->table->getColumnPrefix()}.{$firstCol}";
				}
			// If there are no columns, we can just do count(*)
			} else {
				$sql .= "*";
			}
			$sql .= ") ";
			if ($this->countAlias !== null) {
				$sql .= "AS {$this->countAlias} ";
			}
		// If distinct is set, add the distinct directive before the columns
		} else if ($this->distinct) {
			$sql .= 'DISTINCT ';
		}

		// If there is a limit set but no offset, use the SQL Server specific TOP clause
		if ($this->limit !== null && ($this->offset === null || $this->offset === 0)) {
			$sql .= "TOP {$this->limit} ";
		}

		// Track the columns to be included
		$cols = array();
		
		// Only add to the $cols array if not dealing with a count query
		if (!$this->count) {
			// If no columns have been specified for the "from" table, just include * for that table
			if ($this->cols === null) {
				$cols[] = "{$this->table->getColumnPrefix()}.*";
			// Otherwise, figure out which columns to include
			} else {
				// Loop through all the columsn to include
				foreach ($this->cols as $alias=>$col) {
					// If $alias is numeric, means we didn't specify an alias
					if (is_numeric($alias)) {
						$alias = null;
					}
					// If the column is a string, assume we're dealing with a regular table column
					if (is_string($col)) {
						$colSql = "{$this->table->getColumnPrefix()}.{$col}";
					// If we have an Expression object, we just run the toString() method to get the value
					} else if ($col instanceOf Expression) {
						$colSql = $col->toString();
					// If we have a Select object, our column is a subquery so we wrap it in parentheses
					} else if ($col instanceOf Select) {
						$colSql = "({$col->toString()})";
					// For any other case, throw an exception
					} else {
						throw new \NP\core\Exception('Invalid column definition');
					}
					// If there is a column alias, add it
					if ($alias !== null) {
						$colSql .= " AS {$alias}";
					}
					// Add the column SQL to the column array
					$cols[] = $colSql;
				}
			}
		}

		// Now we need to look through the join columns
		$joins = array();
		// Loop through all joins
		foreach ($this->joins as $join) {
			// Only add to the $cols array if not dealing with a count query
			if (!$this->count) {
				// If the columns are set to null, assume we're retrieving all of them
				if ($join->getCols() === null) {
					$cols[] = "{$join->getTable()->getColumnPrefix()}.*";
				// Otherwise, need to see which columns we need
				} else {
					// Loop through ever column for that join
					foreach ($join->getCols() as $alias=>$col) {
						// If $alias is not a number, means we set a column alias
						if (!is_numeric($alias)) {
							$col .= " AS {$alias}";
						}
						$cols[] = "{$join->getTable()->getColumnPrefix()}.{$col}";
					}
				}
			}
			
			// Append to the join array for joining later
			$joins[] = $join->toString();
		}

		// Join all the columns separated by commas for the SELECT clause and add to the main $sql string
		$sql .= implode(',', $cols);
		
		// Add the query FROM clause if there is one
		if ($this->table !== null) {
			$sql .= " FROM {$this->table->toString()}";
		}
		
		// Add all the joins to the query
		if (count($joins)) {
			$sql .= ' ' . implode(' ', $joins);
		}

		// If there's a where clause, add it
		if ($this->where !== null) {
			$where = $this->where->toString();
			if ($where != '') {
				$sql .= ' WHERE ' . $where;
			}
		}

		// If there are unions, process them
		foreach ($this->unions as $union) {
			$unionClause = ($union['isAll']) ? 'UNION ALL' : 'UNION';
			$sql .= "
				{$unionClause}
				{$union['select']->toString()}
			";
		}

		// If there's a group by clause, add it
		if ($this->group !== null) {
			$sql .= " GROUP BY " . $this->group->toString();
		}

		// If there's a having clause, add it
		if ($this->having !== null) {
			$having = $this->having->toString();
			if ($having != '') {
				$sql .= ' HAVING ' . $having;
			}
		}

		// If there's an order clause, add it
		if ($this->order !== null && ($this->offset === null || $this->offset === 0)) {
			$sql .= " ORDER BY " . $this->order->toString();
		}

		// If there's an offset, process it
		if ($this->limit !== null && $this->offset !== null && $this->offset !== 0) {
			// In the case of an offset, we want to remove aliases from the order fields
			$offsetOrder = preg_replace('/\w+\./', '', $this->order->toString());
			// Wrap the table in two selects to use ROW_NUMBER() for pagination
			// (the second outer SELECT is needed so we can order by a column that's a subquery)
			$sql = "
				SELECT * FROM (
					SELECT *, ROW_NUMBER() OVER (ORDER BY {$offsetOrder}) AS __rowNumber__
					FROM ({$sql}) AS __innerWrapperTable__
				) AS __outerWrapperTable__
				WHERE __rowNumber__
			";
			// Figure out what rows to display
			$startRow = $this->offset + 1;
			// If we have a limit clause, use a BETWEEN operator
			if ($this->limit !== null) {
				$endRow = $this->offset + $this->limit;
				$sql .= "BETWEEN {$startRow} AND {$endRow}";
			// Otherwise just do a greater than or equal
			} else {
				$sql .= ">= {$startRow}";
			}
		}

		return $sql;
	}
}
?>