<?php

namespace NP\shared\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICEPOFORWARD to USERPROFILE table
 *
 * @author Thomas Messier
 */
class InvoicePoForwardToUserJoin extends Join {
	
	public function __construct($cols=null, $type=Select::JOIN_LEFT, $toAlias='ut', $fromAlias='ipf') {
		if ($cols === null) {
			$cols = array('to_userprofile_username' => 'userprofile_username');
		}
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.forward_to_userprofile_id = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType($type);
	}
	
}