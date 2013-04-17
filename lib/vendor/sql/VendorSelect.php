<?php

namespace NP\vendor\sql;

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
	 * Builds the Select statement to conform to the common basic requirements when showing vendors in an auto-complete drop-down
	 *
	 * @param  int $allowExpiredInsurance Whether you want to vendors with expired insurance or not; if 1 they will show, if 0 they will not
	 * @return NP\vendor\VendorSelect     Returns caller object for easy chaining
	 */
	public function populateForDropdown($allowExpiredInsurance=0) {
		$this->columns(array('vendor_id','vendor_id_alt','vendor_name'))
				->joinVendorsite(array('vendorsite_id'))
				->joinAddress(array('address_line1','address_city','address_state','address_zip'))
				->whereLike('v.vendor_name', ':vendor_name')
				->whereEquals('vs.vendorsite_status', "'active'")
				->whereEquals('v.vendor_status', "'active'")
				->order('v.vendor_name ASC')
				->limit(50)
				->offset(0);
		
		if ($allowExpiredInsurance == 0) {
			$this->filterExpiredInsurance();
		}

		return $this;
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
	
	/**
	 * Filters vendors that are no longer active based on the activation date fields
	 *
	 * @param  int $vendorsite_id          vendorsite_id of a vendor we want included even if expired
	 * @return \NP\vendor\sql\VendorSelect Returns caller object for easy chaining
	 */
	public function filterInactiveDate($vendorsite_id=null) {
		$now = "'" . \NP\util\Util::formatDateForDB() . "'";
		$this->whereNest('OR')
			->whereNest()
			->whereNest('OR')
			->whereLessThanOrEqual('v.vendor_active_startdate', $now)
			->whereIsNull('v.vendor_active_startdate')
			->whereUnnest()
			->whereNest('OR')
			->whereGreaterThan('v.vendor_active_enddate', $now)
			->whereIsNull('v.vendor_active_enddate')
			->whereUnnest()
			->whereUnnest();

		if ($vendorsite_id !== null) {
			$this->whereEquals('vs.vendorsite_id', ':vendorsite_id')
				->whereUnnest();
		}
		
		return $this;
	}
	
	/**
	 * Fitlers out vendors with expired insurances
	 *
	 * @return \NP\vendor\sql\VendorSelect Returns caller object for easy chaining
	 */
	public function filterExpiredInsurance() {
		$now = "'" . \NP\util\Util::formatDateForDB() . "'";

		$propertySubSelect = new Select();
		$propertySubSelect->column('property_id')
						->from(array('insp'=>'property'))
						->whereEquals('v.integration_package_id', 'insp.integration_package_id');

		$insuranceSubSelect = new Select();
		$insuranceSubSelect->distinct()
				->column('tablekey_id')
				->from(array('i'=>'insurance'))
				->join(array('lip' => 'link_insurance_property'),
					'lip.insurance_id = i.insurance_id',
					array())
				->whereIsNotNull('i.insurancetype_id')
				->whereEquals('i.table_name', "'vendor'")
				->whereLessThanOrEqual('i.insurance_expdatetm', $now)
				->whereIn('lip.property_id', $propertySubSelect);

		$this->whereNotIn('v.vendor_id', $insuranceSubSelect);
		
		return $this;
	}
	
}