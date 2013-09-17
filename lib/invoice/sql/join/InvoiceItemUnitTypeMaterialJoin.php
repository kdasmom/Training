<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICEITEM to UTILITYACCOUNT table
 *
 * @author Thomas Messier
 */
class InvoiceItemUnitTypeMaterialJoin extends Join {
	
	public function __construct($cols=array('unittype_material_name'), $type=Select::JOIN_LEFT, $toAlias='utm', $fromAlias='ii') {
		$this->setTable(array($toAlias=>'unittype_material'))
			->setCondition("{$fromAlias}.unittype_material_id = {$toAlias}.unittype_material_id")
			->setCols($cols)
			->setType($type);
	}
	
}