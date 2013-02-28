<?php

namespace NP\vendor;

use NP\core\db\Select;

/**
 * A custom Select object for Vendor records with some shortcut methods
 *
 * @author Thomas Messier
 */
class VendorSelect extends Select {
	
	public function __construct() {
		parent::__construct();
		$this->from(array('v'=>'vendor'));
	}
	
	/**
	 * Joins VENDORSITE table
	 *
	 * @param  string[] $cols         Columns to retrieve
	 * @return NP\vendor\VendorSelect Returns caller object for easy chaining
	 */
	public function joinVendorsite($cols=array()) {
		return $this->join(array('vs' => 'vendorsite'),
						'v.vendor_id = vs.vendor_id',
						$cols);
	}
	
	/**
	 * Left joins ADDRESS table
	 *
	 * @param  string[] $cols         Columns to retrieve
	 * @return NP\vendor\VendorSelect Returns caller object for easy chaining
	 */
	public function joinAddress($cols=array()) {
		return $this->join(array('a' => 'address'),
							"vs.vendorsite_id = a.tablekey_id
							AND a.table_name = 'vendorsite'
							AND a.addresstype_id = (SELECT addresstype_id FROM addresstype WHERE addresstype_name = 'Mailing')",
						$cols,
						static::JOIN_LEFT);
	}
	
}