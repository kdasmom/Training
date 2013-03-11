<?php
namespace NP\core\db;

/**
 * Abstracts the WHERE clause of a SQL statement to an object
 *
 * @author Thomas Messier
 */
class Where implements SQLElement {

	const OR_OP  = 'OR';
	const AND_OP = 'AND';

	/**
	 * @var array Collection of criteria for WHERE clause
	 */
	protected $predicates = array();

	/**
	 * @var \NP\core\db\Where Points to the current Where object in the nested object structure
	 */
	protected $currentWhere;

	/**
	 * @var \NP\core\db\Where Points to the Where object one level below in the nested object structure
	 */
	protected $previousWhere;

	/**
	 * @var string Logical operator used (can be "AND" or "OR")
	 */
	protected $logicalOperator;

	/**
	 * @param $where           string|array|NP\core\db\Where Initial where criteria (optional)
	 * @param $logicalOperator string                        Logical operator to use (can be "AND" or "OR")
	 */
	public function __construct($where=null, $logicalOperator=self::AND_OP) {
		// Uppercase the logical operator
		$logicalOperator = strtoupper($logicalOperator);
		// Make sure logical operator passed is valid
		if (!in_array($logicalOperator, array(self::OR_OP, self::AND_OP))) {
			throw new \NP\core\Exception('The $logicalOperator argument must be equal to "' . self::AND_OP . '" OR "' . self::OR_OP . '".');
		}
		// Set the logical operator
		$this->logicalOperator = $logicalOperator;

		// Set the pointer to the Where object we are currently accessing in the nested structure
		$this->currentWhere = $this;

		// If a $where argument is defined, set it
		if ($where !== null) {
			// If $where is an array, loop throw the elements and set them all as "equals" predicates
			if (is_array($where)) {
				foreach($where as $col=>$val) {
					if (is_numeric($col)) {
						throw new \NP\core\Exception('If $where is an array, it must be an associative array.');
					}
					$this->equals($col, $val);
				}
			// If $where is a string, just add it as an Expression
			} else if (is_string($where)) {
				$this->expression($where);
			// Otherwise, the $where argument is invalid
			} else {
				throw new \NP\core\Exception('The $where arguments must be a string or an array.');
			}
		}
	}

	/**
	 * Create a new nesting group in the WHERE clause
	 *
	 * @param  $logicalOperator string Logical operator to use (can be "AND" or "OR")
	 * @param \NP\core\db\Where        A newly created nested Where object for easy chaining
	 */
	public function nest($logicalOperator=self::AND_OP) {
		// Make sure the $logicalOperator arguments is valid
		if (!in_array($logicalOperator, array(self::OR_OP, self::AND_OP))) {
			throw new \NP\core\Exception('The $logicalOperator argument must be equal to "' . self::AND_OP . '" OR "' . self::OR_OP . '".');
		}
		// Create a new Where object for the nested group
		$this->currentWhere = new Where(null, $logicalOperator);

		// Point previousWhere to the current object
		$this->currentWhere->previousWhere = $this;

		// Add the new Where object as a condition
		$this->predicates[] = $this->currentWhere;

		// Return the new Where object so that all subsequent operations are done against it
		return $this->currentWhere;
	}

	/**
	 * Exit a nesting group in the WHERE clause
	 *
	 * @param \NP\core\db\Where The Where object one level done in the nesting structure
	 */
	public function unnest() {
		// Move back down one level
		$this->currentWhere = $this->currentWhere->previousWhere;

		// Return Where object so that all subsequent operations are done against it
		return $this->currentWhere;
	}

	/**
	 * Magic method for the OR and AND methods since they are reserved words that cannot be used
	 *
	 * @param  $name      string Name of the method to call; valid values are "AND" or "OR"
	 * @param  $arguments array  Arguments passed to the method
	 * @param \NP\core\db\Where  The Where object one level done in the nesting structure
	 */
	public function __call($name, $arguments) {
		switch (strtolower($name)) {
            case 'or':
            	$this->currentWhere->logicalOperator = 'OR';
            	break;
            case 'and':
                $this->currentWhere->logicalOperator = 'AND';
                break;
            default:
            	throw new \NP\core\Exception("You can only call and() or or(). No other magic methods are supported.");
        }
        return $this->currentWhere;
    }

    /**
     * Generic function that can be used to call any comparison operator
     *
     * @param  string            $operator The operator to use
     * @param  string|SQLElement $left     Left side of the comparison
     * @param  string|SQLElement $right    Right side of the comparison
     * @param  string|SQLElement $right2   Second right side of the comparison (optional); only used by BETWEEN operator
     * @param \NP\core\db\Where            The current Where object
     */
	public function op($operator, $left, $right, $right2=null) {
		$operator = strtoupper($operator);
		$left = ($left instanceOf SQLElement) ? $left : new Expression($left);
		$right = ($right instanceOf SQLElement) ? $right : new Expression($right);

		if ($right2 !== null) {
			$right2 = ($right2 instanceOf SQLElement) ? $right2 : new Expression($right2);
		}
		if ($operator == 'BETWEEN') {
			$this->currentWhere->predicates[] = array('operator'=>$operator, 'left'=>$left, 'right'=>$right, 'right2'=>$right2);
		} else {
			$this->currentWhere->predicates[] = array('operator'=>$operator, 'left'=>$left, 'right'=>$right);	
		}
		
		return $this->currentWhere;
	}

	/**
	 * Allows adding an arbitrary string expression as a condition
	 *
	 * @param  $where string    A string to be used in the WHERE clause
	 * @param \NP\core\db\Where The current Where object
	 */
	public function expression($where) {
		$this->currentWhere->predicates[] = new Expression($where);

		return $this->currentWhere;
	}

	/**
	 * Shortcut for op('=', $left, $right)
	 *
	 * @param  string|SQLElement $left  Left side of the comparison
     * @param  string|SQLElement $right Right side of the comparison
     * @param \NP\core\db\Where         The current Where object
	 */
	public function equals($left, $right) {
		return $this->currentWhere->op('=', $left, $right);
	}

	/**
	 * Shortcut for op('<>', $left, $right)
	 *
	 * @param  string|SQLElement $left  Left side of the comparison
     * @param  string|SQLElement $right Right side of the comparison
     * @param \NP\core\db\Where         The current Where object
	 */
	public function notEquals($left, $right) {
		return $this->currentWhere->op('<>', $left, $right);
	}

	/**
	 * Shortcut for op('IN', $left, $right)
	 *
	 * @param  string|SQLElement $left  Left side of the comparison
     * @param  string|SQLElement $right Right side of the comparison
     * @param \NP\core\db\Where         The current Where object
	 */
	public function in($left, $right) {
		return $this->currentWhere->op('IN', $left, $right);
	}

	/**
	 * Shortcut for op('NOT IN', $left, $right)
	 *
	 * @param  string|SQLElement $left  Left side of the comparison
     * @param  string|SQLElement $right Right side of the comparison
     * @param \NP\core\db\Where         The current Where object
	 */
	public function notIn($left, $right) {
		return $this->currentWhere->op('NOT IN', $left, $right);
	}

	/**
	 * Shortcut for op('LIKE', $left, $right)
	 *
	 * @param  string|SQLElement $left  Left side of the comparison
     * @param  string|SQLElement $right Right side of the comparison
     * @param \NP\core\db\Where         The current Where object
	 */
	public function like($left, $right) {
		return $this->currentWhere->op('LIKE', $left, $right);
	}

	/**
	 * Shortcut for op('BETWEEN', $left, $right, $right2)
	 *
	 * @param  string|SQLElement $left   Left side of the comparison
     * @param  string|SQLElement $right  Right side of the comparison
     * @param  string|SQLElement $right2 Second right side of the comparison
     * @param \NP\core\db\Where          The current Where object
	 */
	public function between($left, $right, $right2) {
		return $this->currentWhere->op('BETWEEN', $left, $right, $right2);
	}

	/**
	 * Shortcut for op('>', $left, $right)
	 *
	 * @param  string|SQLElement $left  Left side of the comparison
     * @param  string|SQLElement $right Right side of the comparison
     * @param \NP\core\db\Where         The current Where object
	 */
	public function greaterThan($left, $right) {
		return $this->currentWhere->op('>', $left, $right);
	}

	/**
	 * Shortcut for op('>=', $left, $right)
	 *
	 * @param  string|SQLElement $left  Left side of the comparison
     * @param  string|SQLElement $right Right side of the comparison
     * @param \NP\core\db\Where         The current Where object
	 */
	public function greaterThanOrEqual($left, $right) {
		return $this->currentWhere->op('>=', $left, $right);
	}

	/**
	 * Shortcut for op('<', $left, $right)
	 *
	 * @param  string|SQLElement $left  Left side of the comparison
     * @param  string|SQLElement $right Right side of the comparison
     * @param \NP\core\db\Where         The current Where object
	 */
	public function lessThan($left, $right) {
		return $this->currentWhere->op('<', $left, $right);
	}

	/**
	 * Shortcut for op('<=', $left, $right)
	 *
	 * @param  string|SQLElement $left  Left side of the comparison
     * @param  string|SQLElement $right Right side of the comparison
     * @param \NP\core\db\Where         The current Where object
	 */
	public function lessThanOrEqual($left, $right) {
		return $this->currentWhere->op('<=', $left, $right);
	}

	/**
	 * Returns a string representation of the Where object
	 *
	 * @return string
	 */
	public function toString() {
		$sql = '(';
		$collection = array();

		// Loop through every condition saved
		foreach($this->predicates as $predicate) {
			// If the condition is a Where object, it's because we have a nested condition
			if ($predicate instanceOf Where) {
				$collection[] = $predicate->toString();
			// Otherwise, we have a regular condition within this nested group
			} else {
				// If the condition is an Expression object, just convert it to a string
				if ($predicate instanceOf Expression) {
					$collection[] = $predicate->toString();
				// Otherwise, we have an operator condition
				} else {
					$left = $predicate['left']->toString();
					// If the left side of our condition is a Select object, it's a subquery 
					// that we need to wrap in parentheses
					if ($predicate['left'] instanceOf Select) {
						$left = "({$left})";
					}
					$right = $predicate['right']->toString();
					// If the right side of our condition is a Select object, it's a subquery 
					// that we need to wrap in parentheses
					if ($predicate['right'] instanceOf Select || in_array($predicate['operator'], array('IN','NOT IN'))) {
						$right = "({$right})";
					}
					// If we're using a between operator, run special logic because it has two items on the right side
					if ($predicate['operator'] == 'BETWEEN') {
						$right2 = $predicate['right2']->toString();
						if ($predicate['right2'] instanceOf Select) {
							$left = "({$right2})";
						}
						$collection[] = $left . " BETWEEN " . $right . " AND " . $right2;
					// Otherwise, run the same thing for all other operators
					} else {
						$collection[] = $left . " {$predicate['operator']} " . $right;
					}
				}
			}
		}
		// Join all predicates using the logical operator for this Where object
		$sql .= implode(" {$this->logicalOperator} ", $collection);
		$sql .= ')';

		return $sql;
	}
}
?>