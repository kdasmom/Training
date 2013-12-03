<?php

namespace NP\shared\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICEPOFORWARD to USERPROFILE table
 *
 * @author Thomas Messier
 */
class InvoicePoForwardFromUserJoin extends Join {
	
	public function __construct($cols=null, $type=Select::JOIN_INNER, $toAlias='uf', $fromAlias='ipf') {
		if ($cols === null) {
			$cols = array('from_userprofile_username' => 'userprofile_username');
		}
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.forward_from_userprofile_id = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType($type);
	}
	
}