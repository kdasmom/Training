<?php

namespace NP\core;

use Zend\Db\Sql\Select;

class SqlSelect extends Select {
	
	public function column($val, $alias=null) {
		if ($alias === null) {
			$this->columns[] = $val;
		} else {
			$this->columns[$alias] = $val;
		}
		
		return $this;
	}
	
}

?>