<?php

namespace NP\property\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from property to region table
 *
 * @author Thomas Messier
 */
class PropertyFaxJoin extends Join {
	
	public function __construct($cols=null, $type=Select::JOIN_LEFT, $toAlias='ph2', $fromAlias='pr') {
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
		$this->setTable(array($toAlias=>'phone'))
			->setCondition("{$toAlias}.tablekey_id = {$fromAlias}.property_id AND {$toAlias}.table_name = 'property' AND {$toAlias}.phonetype_id = (SELECT phonetype_id FROM phonetype WHERE phonetype_name = 'Fax')")
			->setCols($cols)
			->setType($type);
	}
	
}