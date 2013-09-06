<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICE to PROPERTY table
 *
 * @author Thomas Messier
 */
class InvoicePropertyJoin extends Join {
	
	public function __construct($cols=array('property_name,property_id_alt,property_status'), $type=Select::JOIN_INNER, $toAlias='pr', $fromAlias='i') {
		$this->setTable(array($toAlias=>'property'))
			->setCondition("{$fromAlias}.property_id = {$toAlias}.property_id")
			->setCols($cols)
			->setType($type);
	}
	
}