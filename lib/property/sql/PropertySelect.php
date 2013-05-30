<?php

namespace NP\property\sql;

use NP\core\db\Select;

/**
 * A custom Select object for Property records with some shortcut methods
 *
 * @author Thomas Messier
 */
class PropertySelect extends Select {
	
	public function __construct() {
		parent::__construct();
		$this->from(array('p'=>'property'));
	}
	
	/**
	 * Joins INTEGRATIONPACKAGE table
	 *
	 * @param  string[] $cols                  Columns to retrieve from the table
	 * @return \NP\property\sql\PropertySelect Returns caller object for easy chaining
	 */
	public function joinIntegrationPackage($cols=array()) {
		return $this->join(array('ip' => 'integrationpackage'),
						'p.integration_package_id = ip.integration_package_id',
						$cols);
	}
	
	/**
	 * Joins REGION table
	 *
	 * @param  string[] $cols                  Columns to retrieve from the table
	 * @return \NP\property\sql\PropertySelect Returns caller object for easy chaining
	 */
	public function joinRegion($cols=array()) {
		return $this->join(array('r' => 'region'),
						'p.region_id = r.region_id',
						$cols,
						Select::JOIN_LEFT);
	}
	
	/**
	 * Joins USERPROFILE table for created by user
	 *
	 * @param  string[] $cols                  Columns to retrieve from the table
	 * @return \NP\property\sql\PropertySelect Returns caller object for easy chaining
	 */
	public function joinCreatedByUser($cols=array()) {
		return $this->join(array('u' => 'userprofile'),
						'p.UserProfile_ID = u.userprofile_id',
						$cols,
						Select::JOIN_LEFT);
	}
	
	/**
	 * Joins PERSON table for created by user
	 *
	 * @param  string[] $cols                  Columns to retrieve from the table
	 * @return \NP\property\sql\PropertySelect Returns caller object for easy chaining
	 */
	public function joinCreatedByPerson($cols=array()) {
		return $this->join(array('ur' => 'userprofilerole'),
						'u.userprofile_id = ur.userprofile_id',
						array(),
						Select::JOIN_LEFT)
					->join(array('s' => 'staff'),
						'ur.tablekey_id = s.staff_id',
						array(),
						Select::JOIN_LEFT)
					->join(array('pe' => 'person'),
						's.person_id = pe.person_id',
						$cols,
						Select::JOIN_LEFT);
	}
	
	/**
	 * Joins USERPROFILE table for created by user
	 *
	 * @param  string[] $cols                  Columns to retrieve from the table
	 * @return \NP\property\sql\PropertySelect Returns caller object for easy chaining
	 */
	public function joinUpdatedByUser($cols=array()) {
		return $this->join(array('u2' => 'userprofile'),
						'p.last_updated_by = u2.userprofile_id',
						$cols,
						Select::JOIN_LEFT);
	}
	
	/**
	 * Joins PERSON table for last updated by user
	 *
	 * @param  string[] $cols                  Columns to retrieve from the table
	 * @return \NP\property\sql\PropertySelect Returns caller object for easy chaining
	 */
	public function joinUpdatedByPerson($cols=array()) {
		return $this->join(array('ur2' => 'userprofilerole'),
						'u2.userprofile_id = ur2.userprofile_id',
						array(),
						Select::JOIN_LEFT)
					->join(array('s2' => 'staff'),
						'ur2.tablekey_id = s2.staff_id',
						array(),
						Select::JOIN_LEFT)
					->join(array('pe2' => 'person'),
						's2.person_id = pe2.person_id',
						$cols,
						Select::JOIN_LEFT);
	}
	
	/**
	 * Joins ADDRESS table
	 *
	 * @param  string[] $cols                  Columns to retrieve from the table
	 * @return \NP\property\sql\PropertySelect Returns caller object for easy chaining
	 */
	public function joinAddress($cols=null) {
		return $this->join(array('a' => 'address'),
						"a.tablekey_id = p.property_id AND a.table_name = 'property'",
						$cols,
						Select::JOIN_LEFT);
	}
	
	/**
	 * Joins PHONE table for phone number
	 *
	 * @param  string[] $cols                  Columns to retrieve from the table
	 * @return \NP\property\sql\PropertySelect Returns caller object for easy chaining
	 */
	public function joinPhone($cols=null) {
		return $this->join(array('ph' => 'phone'),
						"ph.tablekey_id = p.property_id AND ph.table_name = 'property' AND ph.phonetype_id = (SELECT phonetype_id FROM phonetype WHERE phonetype_name = 'Main')",
						$cols,
						Select::JOIN_LEFT);
	}
	
	/**
	 * Joins PHONE table for fax number
	 *
	 * @param  string[] $cols                  Columns to retrieve from the table
	 * @return \NP\property\sql\PropertySelect Returns caller object for easy chaining
	 */
	public function joinFax($cols=null) {
		if ($cols === null) {
			$cols = array(
				'fax_phone_id'          =>'phone_id',
				'fax_phonetype_id'      =>'phonetype_id',
				'fax_tablekey_id'       =>'tablekey_id',
				'fax_table_name'        =>'table_name',
				'fax_phone_number'      =>'phone_number',
				'fax_phone_ext'         =>'phone_ext',
				'fax_phone_countrycode' =>'phone_countrycode'
			);
		}
		return $this->join(array('ph2' => 'phone'),
						"ph2.tablekey_id = p.property_id AND ph2.table_name = 'property' AND ph2.phonetype_id = (SELECT phonetype_id FROM phonetype WHERE phonetype_name = 'Fax')",
						$cols,
						Select::JOIN_LEFT);
	}
	
	/**
	 * Joins PROPERTY table for bill to or ship to property
	 *
	 * @return \NP\property\sql\PropertySelect Returns caller object for easy chaining
	 */
	public function joinBillOrShipToProperty($type) {
		$type = strtolower($type);
		if (!in_array($type, array('bill','ship'))) {
			throw new \NP\core\Exception('$type argument is invalid. Valid values are "bill" or "ship".');
		}
		return $this->join(array("{$type}p" => 'property'),
						"p.default_billto_property_id = {$type}p.property_id",
						array(
							"default_{$type}to_property_name"=>'property_name',
							"default_{$type}to_property_id_alt"=>'property_id_alt'
						),
						Select::JOIN_LEFT);
	}
	
}