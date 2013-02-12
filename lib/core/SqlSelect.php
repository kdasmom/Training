<?php

namespace NP\core;

use Zend\Db\Sql\Select;

/**
 * Custom Select class that adds to Zend\Db\Sql\Select
 * 
 * @author Thomas Messier
 */
class SqlSelect extends Select {
	
	/**
     * Adds a column method to the list of table columns to retrieve
     * 
     * @param  string    $col   The name of the column to add
     * @param  string    $alias An alias for the column (optional)
     * @return SqlSelect        Method returns caller object to allow chaining
     */
	public function column($col, $alias=null) {
		if ($alias === null) {
			$this->columns[] = $col;
		} else {
			$this->columns[$alias] = $col;
		}
		
		return $this;
	}
	
}

?>