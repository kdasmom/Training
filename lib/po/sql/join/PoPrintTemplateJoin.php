<?php

namespace NP\po\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from PURCHASEORDER to Print_Templates table
 *
 * @author Thomas Messier
 */
class PoPrintTemplateJoin extends Join {
	
	public function __construct($cols=array('Print_Template_Name'), $type=Select::JOIN_LEFT, $toAlias='pt', $fromAlias='p') {
		$this->setTable(array($toAlias=>'Print_Templates'))
			->setCondition("{$fromAlias}.print_template_id = {$toAlias}.Print_Template_Id")
			->setCols($cols)
			->setType($type);
	}
	
}