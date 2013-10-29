<?php

namespace NP\shared\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICEPOFORWARD to USERPROFILE table
 *
 * @author Thomas Messier
 */
class InvoicePoForwardDelegationUserJoin extends Join {
	
	public function __construct($cols=null, $type=Select::JOIN_LEFT, $toAlias='ud', $fromAlias='ipf') {
		if ($cols === null) {
			$cols = array('delegation_userprofile_username' => 'userprofile_username');
		}
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.from_delegation_to_userprofile_id = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType($type);
	}
	
}