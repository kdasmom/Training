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
abstract class AbstractGateway implements LoggingAwareInterface {
	
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
	 * The logging service singleton gets automatically injected by Zend Di via setter injection
	 * (setLoggingService() function).
	 *
	 * @var NP\system\LoggingService The logging service singleton
	 */
	protected $loggingService;

	/**
	 * The constructor sets up defaults an calls parent initialize() function
	 *
	 * @param Zend\Db\Adapter\Adapter $adapter The DB adapter that is automatically injected by Zend Di (see config.php and di_config.php for configuration)
	 */
	public function __construct(Adapter $adapter) {
		$this->adapter = $adapter;
		
		if ($this->table === null) {
			$this->table = explode('\\', str_replace('Gateway', '', get_called_class()));
			$this->table = strtolower($this->table[count($this->table)-1]);
		}
		
		if ($this->pk === null) {
			$this->pk = $this->table . '_id';
		}
		
		$this->initialize();
	}
	
	/**
	 * @internal Setter function required by Zend Di to set the logging service via setter injection
	 * @param NP\system\LoggingService $loggingService
	 */
	public function setLoggingService(\NP\system\LoggingService $loggingService) {
		$this->loggingService = $loggingService;
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
	 * @param  int $id The primary key value for which you want to retrieve a record
	 * @return array   An associative array with the data
	 */
	public function findById($id) {
		$select = $this->getSelect();
		$select->where(array("{$this->table}.{$this->pk}"=>":{$this->pk}"));

		$res = $this->adapter->query($select, array("{$this->pk}"=>$id));
		
		return $res[0];
	}
	
	/**
	 * Utility function to retrieve records based on criteria
	 * 
	 * @param  Zend\Db\Sql\Where|\Closure|string|array $where   The criteria by which to filter records
	 * @param  array                                   $params  Parameters to bind to the query (optional)
	 * @param  string|array                            $order   Ordering of the records (optional)
	 * @param  array                                   $columns Columns to retrieve (optional)
	 * @param  Zend\Db\Sql\Select                      $select  A custom Select object to use (optional)
	 * @return array   An positional array filled with associative arrays of each record found
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
	
	public function insert($set) {
		
	}
	
	public function update($set) {
		
	}

	public function save($set) {
		if (array_key_exists($this->pk, $set) && is_numeric($this->pk)) {
			$this->update($set);
			return $this->{$this->pk};
		} else {
			$this->insert($set);
			return $this->getLastInsertValue();
		}
	}

	public function lastInsertId() {
		return $this->adapter->lastInsertId();
	}

	/**
	 * This function can be overridden to specify a default select to use (if you want some joins by default, for example)
	 */
	protected function getSelect() {
		return $this->getSql()->select();
	}
	
	/**
	 * Utility function to run a query based on a select object and get an array back
	 *
	 * @param  Zend\Db\Sql\Select $select A select object
	 * @param  array              $params An array of parameters to bind to the query
	 * @return array                      Positional array filled with associative arrays of records
	 */
	public function executeSelectWithParams($select, $params) {
		return $this->adapter->query($select, $params);
	}
	
	/**
	 * Utility function used to get an array with paging data from a Select object
	 *
	 * @param  Zend\Db\Sql\Select $select      A select object
	 * @param  array              $params      An array of parameters to bind to the query
	 * @param  int                $pageSize    The number of records per page
	 * @param  int                $page        The page number to retrieve (optional); defaults to 1
	 * @param  boolean            $hasSubquery Indicates if the select query contains a subquery in the select clause
	 * @return array                           Associative array with 2 keys: 'total' has the total number of records for the query and 'data' has the records for the selected page and pagesize requested
	 */
	public function getPagingArray($select, $params, $pageSize, $page=1, $hasSubquery=false) {
		$selectTotal = $this->getSelectCountForPaging($select);
		
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
	 * @param  Zend\Db\Sql\Select $select      A select object
	 * @return Zend\Db\Sql\Select              A select object like the one passed in but removing columns and doing a count(*) instead
	 */
	public function getSelectCountForPaging($select) {
		// Clone the select statement passed to use it as a base
		$selectTotal = clone $select;
		// Remove the order by clause
		$selectTotal->order(null);
		// Set a new column for the count
		$selectTotal->columns(array('totalRows' => new Expression('count(*)'))); 
		// Get all the existing joins
		$joins = $selectTotal->getRawState('joins');
		// Remove existing joins
		$selectTotal->joins(null);
		// Recreate the joins without the columns
		foreach($joins as $join) {
			$selectTotal->join($join['name'], $join['on'], array(), $join['type']);
		}
		
		// Return the new Select object
		return $selectTotal;
	}
	
}