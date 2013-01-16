<?php

namespace NP\vendor;

use NP\core\SqlSelect;

use Zend\Db\Sql\Expression;

class VendorSelect extends SqlSelect {
	
	public function __construct() {
		parent::__construct();
		$this->from(array('v'=>'vendor'));
	}
	
	public function joinVendorsite($cols=array()) {
		return $this->join(array('vs' => 'vendorsite'),
						'v.vendor_id = vs.vendor_id',
						$cols);
	}
	
	public function joinAddress($cols=array()) {
		return $this->join(array('a' => 'address'),
							new Expression("vs.vendorsite_id = a.tablekey_id
							AND a.table_name = 'vendorsite'
							AND a.addresstype_id = (SELECT addresstype_id FROM addresstype WHERE addresstype_name = 'Mailing')"),
						$cols,
						static::JOIN_LEFT);
	}
	
}