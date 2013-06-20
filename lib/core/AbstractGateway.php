<?php

namespace NP\core;

/**
 * This is an abstract class that must be extended by all gateways in the system.
 *
 * AbstractGateway leverages the AbstractTableGateway class of the Zend Framework to provide a number of
 * utility functions for dealing with database CRUD operations.
 * 
 * @abstract
 * @author Thomas Messier
 */
abstract class AbstractGateway {
	
	/**
	 * Override this in class implementation to specify table name
	 *
	 * If this property is not overridden, the convention assumes that the table name is the name of the Gateway
	 * class without the "Gateway" at the end
	 *
	 * @var string Name of the database table the implemented gateway uses
	 */
	protected $table;
	
	/**
	 * Override this in class implementation to specify main table alias
	 *
	 * If this property is not overridden, the convention assumes that the alias is the same as the table name
	 *
	 * @var string Name of the table alias; useful if you override getSelect() and the select statement uses a certain table alias, that way findById can still work without ambiguous column name errors
	 */
	protected $tableAlias;
	
	/**
	 * Override this in class implementation to specify table primary key name
	 *
	 * If this property is not overridden, the convention assumes that the primary key is the table name followed
	 * by _id
	 *
	 * @var string Name of the database table primary key
	 */
	protected $pk;

	/**
	 * The logging service singleton
	 * 
	 * The logging service singleton gets automatically injected via setter injection
	 * (setLoggingService() function).
	 *
	 * @var \NP\system\LoggingService The logging service singleton
	 */
	protected $loggingService;

	/**
	 * The constructor sets up defaults an calls parent initialize() function
	 *
	 * @param \NP\core\db\Adapter $adapter The DB adapter that is automatically injected (see config.php and di_config.php for configuration)
	 */
	public function __construct(db\Adapter $adapter) {
		$this->adapter = $adapter;
		
		if ($this->table === null) {
			$this->table = explode('\\', str_replace('Gateway', '', get_called_class()));
			$this->table = strtolower($this->table[count($this->table)-1]);
		}
		
		if ($this->tableAlias === null) {
			$this->tableAlias = $this->table;
		}
		
		if ($this->pk === null) {
			$this->pk = $this->table . '_id';
		}
	}
	
	/**
	 * Setter function required by DI to set the logging service via setter injection
	 * @param \NP\system\LoggingService $loggingService
	 */
	public function setLoggingService(\NP\system\LoggingService $loggingService) {
		$this->loggingService = $loggingService;
	}

	/**
	 * @return \NP\core\db\Adapter The DB adapter for this gateway
	 */
	public function getAdapter() {
		return $this->adapter;
	}

	/**
	 * Begins a transaction
	 */
	public function beginTransaction() {
		$this->adapter->beginTransaction();
	}

	/**
	 * Commits a transaction
	 */
	public function commit() {
		$this->adapter->commit();
	}

	/**
	 * Rolls back a transaction
	 */
	public function rollback() {
		$this->adapter->rollback();
	}
	
	/**
	 * @return string The table name for this gateway
	 */
	public function getTable() {
		return $this->table;
	}
	
	/**
	 * @return string The primary key field name for this gateway
	 */
	public function getPk() {
		return $this->pk;
	}
	
	/**
	 * Utility function to retrieve a record for a specific record in the database based on primary key
	 * 
	 * @param  int   $id     The primary key value for which you want to retrieve a record
	 * @param  array [$cols] Columns to retrieve
	 * @return array         An associative array with the data
	 */
	public function findById($id, $cols=null) {
		$select = $this->getSelect();
		$select->where(array("{$this->tableAlias}.{$this->pk}"=>"?"));

		if ($cols !== null) {
			$select->columns($cols);
		}

		$res = $this->adapter->query($select, array($id));
		
		return $res[0];
	}
	
	/**
	 * Utility function to retrieve records based on criteria
	 * 
	 * @param  NP\core\db\Where|string|array $where   The criteria by which to filter records
	 * @param  array                         $params  Parameters to bind to the query (optional)
	 * @param  string|array                  $order   Ordering of the records (optional)
	 * @param  array                         $columns Columns to retrieve (optional)
	 * @param  NP\core\db\Select             $select  A custom Select object to use (optional)
	 * @return array                                  A positional array filled with associative arrays of each record found
	 */
	public function find($where=null, $params=array(), $order=null,  $cols=null, $select=null) {
		// Allow for passing a custom select just in case
		if ($select === null) {
			$select = $this->getSelect();
		}
		
		if ($cols !== null) {
			$select->columns($cols);
		}
		
		if ($where !== null) {
			$select->where($where);
		}
		
		if ($order !== null) {
			$select->order($order);
		}
		
		$res = $this->adapter->query($select, $params);
		
		return $res;
	}
	
	/**
	 * Inserts a record in the database
	 *
	 * @param  array|\NP\core\AbstractEntity $data An associative array with key/value pairs for fields, or an Entity object
	 * @return boolean                             Whether the operation succeeded or not
	 */
	public function insert($data) {
		// If we passed in an entity, get the data for it
		if ($data instanceOf \NP\core\AbstractEntity) {
			$set = $data->toArray();
		} else {
			$set = $data;
		}
		
		// If primary key is in the set remove it
		if (array_key_exists($this->pk, $set)) {
			unset($set[$this->pk]);
		}
		$params = $this->convertFieldsToBindParams($set);

		$insert = new db\Insert($this->table, $params['fields']);

		$res = $this->adapter->query($insert, $params['values']);

		if ($data instanceOf \NP\core\AbstractEntity) {
			$data->{$this->pk} = $this->lastInsertId();
		}

		return $res;
	}
	
	/**
	 * Updates a record in the database
	 *
	 * @param  array|\NP\core\AbstractEntity $data   An associative array with key/value pairs for fields, or an Entity object
	 * @param  NP\core\db\Where|string|array $where  The criteria for which records to delete
	 * @param  array                         $params Parameters to bind to the where clause (the $data parameters are automatically bound) (optional)
	 * @return boolean                               Whether the operation succeeded or not
	 */
	public function update($data, $where=null, $params=array()) {
		// If we passed in an entity, get the data for it
		if ($data instanceOf \NP\core\AbstractEntity) {
			$set = $data->toArray();
		} else {
			$set = $data;
		}

		// If primary key is in set, process it
		if (array_key_exists($this->pk, $set)) {
			// If no where clause was provided, assume the primary key is the where clause
			if ($where === null) {
				$where = array($this->pk=>'?');
				$params = array($set[$this->pk]);
			}
			unset($set[$this->pk]);
		}

		$paramsNew = $this->convertFieldsToBindParams($set);
		$paramsNew['values'] = array_merge($paramsNew['values'], $params);

		$update = new db\Update($this->table, $paramsNew['fields'], $where);
		
		return $this->adapter->query($update, $paramsNew['values']);
	}
	
	/**
	 * Deletes a record from the database
	 *
	 * @param  NP\core\db\Where|string|array $where  The criteria for which records to delete
	 * @param  array                         $params Parameters to bind to the query (optional)
	 * @return boolean                               Whether the operation succeeded or not
	 */
	public function delete($where, $params=array()) {
		if ($where === null) {
			throw new \NP\core\Exception('You must specificy a $where argument');
		}
		$delete = new db\Delete($this->table, $where);
		
		return $this->adapter->query($delete, $params);
	}

	/**
	 * Utility function that takes an associative array and uses the keys to return an array in the format 
	 * array($key=>":{$key}") that can easily be used by a query with values to bind by name
	 *
	 * @param array|\NP\core\AbstractEntity $data       An associative array with key/value pairs for fields, or an Entity object
	 * @param boolean                       $bindByName Whether you want to use named or positional parameters
	 */
	protected function convertFieldsToBindParams($set) {
		$fields = array();
		$values = array();
		foreach($set as $field=>$val) {
			if ($field != $this->pk) {
				$placeHolder = '?';
				$fields[$field] = $placeHolder;
				$values[] = $val;
			}
		}

		return array(
			'fields' => $fields,
			'values' => $values
		);
	}

	/**
	 * Takes an array of values and returns a comma delimited list of placeholders (?). Useful for SQL IN/NO IN clauses
	 *
	 * @param  array  $values
	 * @return string
	 */
	public function createPlaceholders($values) {
		// Create an placeholders for the IN clause
		$placeHolders = array_fill(0, count($values), '?');
		return implode(',', $placeHolders);

	}

	/**
	 * Utility function that calls insert if the primary key is null or doesn't exist and update if it does
	 * 
	 * @param  array|\NP\core\AbstractEntity $data An associative array with key/value pairs for fields, or an Entity object
	 * @return int                                 The primary key value inserted or updated
	 */
	public function save($data) {
		// If we passed in an entity, get the data for it
		if ($data instanceOf \NP\core\AbstractEntity) {
			$set = $data->toArray();
		} else {
			$set = $data;
		}

		if ( array_key_exists($this->pk, $set) && is_numeric($set[$this->pk]) ) {
			return $this->update($data);
		} else {
			$this->insert($data);
			return $this->lastInsertId();
		}
	}

	public function lastInsertId() {
		return $this->adapter->lastInsertId();
	}

	/**
	 * This function can be overridden to specify a default select to use (if you want some joins by default, for example)
	 */
	protected function getSelect() {
		$table = ($this->tableAlias == $this->table) ? $this->table : array($this->tableAlias=>$this->table);
		return new db\Select($table);
	}
	
	/**
	 * Utility function used to get an array with paging data from a Select object
	 *
	 * @param  NP\core\db\Select  $select      A select object
	 * @param  array              $params      An array of parameters to bind to the query
	 * @param  int                $pageSize    The number of records per page
	 * @param  int                $page        The page number to retrieve (optional); defaults to 1
	 * @param  string             $distinctCol Column to use for the count query if DISTINCT is used
	 * @return array                           Associative array with 2 keys: 'total' has the total number of records for the query and 'data' has the records for the selected page and pagesize requested
	 */
	public function getPagingArray($select, $params, $pageSize, $page=1, $distinctCol=null) {
		$selectTotal = $this->getSelectCountForPaging($select, $distinctCol);
		
		// Limit the original query to the page needed
		$select->limit($pageSize);
		if ($page !== null) {
			$select->offset($pageSize * ($page - 1));
		}
		
		$selectRes = $this->adapter->query($select, $params);
		$totalRes = $this->adapter->query($selectTotal, $params);
		
		return array('total'=>$totalRes[0]['totalRows'], 'data'=>$selectRes);
	}
	
	/**
	 * Transforms a select query object to the equivalent select count(*) query
	 *
	 * @param  NP\core\db\Select  $select      A select object
	 * @param \NP\core\db\Select               A select object like the one passed in but removing columns and doing a count(*) instead
	 */
	public function getSelectCountForPaging($select, $distinctCol=null) {
		// Clone the select statement passed to use it as a base
		$selectTotal = clone $select;
		
		// Remove the order by clause
		$selectTotal->order(null);

		// If statement has DISTINCT, use only first column
		$cols = array();
		if ($selectTotal->getRawState('distinct')) {
			$cols[] = $distinctCol;
		}

		// Set a new column for the count
		$selectTotal->columns($cols)
					->count(true, 'totalRows'); 
		
		// Get all the existing joins
		$joins = $selectTotal->getRawState('joins');
		
		// Remove existing joins
		$selectTotal->resetJoins();
		
		// Recreate the joins without the columns
		foreach($joins as $join) {
			$selectTotal->join($join['table'], $join['condition'], array(), $join['type']);
		}
		
		// Return the new Select object
		return $selectTotal;
	}
	
}