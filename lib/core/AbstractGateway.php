<?php

namespace NP\core;

use Zend\Db\TableGateway\AbstractTableGateway;
use Zend\Db\Adapter\Adapter;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Expression;
use Zend\Db\ResultSet\ResultSet;

abstract class AbstractGateway extends AbstractTableGateway implements LoggingAwareInterface {
	
	// Override this in concrete class to specify table name; if not overriden, assumes Gateway name
	protected $table;
	
	// Override this in concrete class to specify table primary key name; if not overriden, assumes table name followed by _id
	protected $pk;

	protected $loggingService;

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
	
	public function setLoggingService(\NP\system\LoggingService $loggingService) {
		$this->loggingService = $loggingService;
	}
	
	public function getTable() {
		return $this->table;
	}
	
	public function getPk() {
		return $this->pk;
	}
	
	public function findById($id) {
		$res = $this->select(array($this->table.".".$this->pk=>$id))->toArray();
		
		return $res[0];
	}
	
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
			$select->order($where);
		}
		
		$res = $this->executeSelectWithParams($select, $params);
		
		return $res;
	}
	
	public function select($where=null) {
		$select = $this->getSelect();
		$select->where($where);
		
		return parent::selectWith($select);
	}
	
	// This function can be overridden to specify a default select to use (if you want some joins by default, for example)
	protected function getSelect() {
		return $this->getSql()->select();
	}
	
	public function executeSelectWithParams($select, $params) {
		$statement = $this->sql->prepareStatementForSqlObject($select);
		$result = $statement->execute($params);
		$resultSet = new ResultSet();
		$resultSet = $resultSet->initialize($result);
		
		return $resultSet->toArray();
	}
	
	public function getPagingArray($select, $params, $pageSize, $page=1, $hasSubquery=false) {
		$selectTotal = $this->getSelectCountForPaging($select);
		
		// If there's a subquery, we need to nest it in another SELECT to make sure it can be sorted by
		if ($hasSubquery) {
			$order = $select->getRawState(Select::ORDER);
			$select->reset(Select::ORDER);
			$oldSelect = $select;
			
			$select = new Select();
			$select->from(array('wrapper_table'=>$oldSelect))
					->order($order);
		}
		
		// Limit the original query to the page needed
		$select->limit($pageSize);
		if ($page !== null) {
			$select->offset($pageSize * ($page - 1));
		}
		
		$selectRes = $this->executeSelectWithParams($select, $params);
		$totalRes = $this->executeSelectWithParams($selectTotal, $params);
		
		return array('total'=>$totalRes[0]['totalRows'], 'data'=>$selectRes);
	}
	
	public function getSelectCountForPaging($select) {
		// Clone the select statement passed to use it as a base
		$selectTotal = clone $select;
		// Remove the order by clause
		$selectTotal->reset(Select::ORDER);
		// Set a new column for the count
		$selectTotal->columns(array('totalRows' => new Expression('count(*)'))); 
		// Get all the existing joins
		$joins = $selectTotal->getRawState(Select::JOINS);
		// Remove existing joins
		$selectTotal->reset(Select::JOINS);
		// Recreate the joins without the columns
		foreach($joins as $join) {
			$selectTotal->join($join['name'], $join['on'], array(), $join['type']);
		}
		
		// Return the new Select object
		return $selectTotal;
	}
	
}