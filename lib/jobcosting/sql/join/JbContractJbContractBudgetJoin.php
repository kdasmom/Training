<?php

namespace NP\jobcosting\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from JBCONTRACT to JBCONTRACTBUDGET table
 *
 * @author Thomas Messier
 */
class JbContractJbContractBudgetJoin extends Join {
	
	public function __construct($useJobBudgets='0', $cols=null, $type=Select::JOIN_LEFT, $toAlias='jbctb', $fromAlias='jbct') {
		if ($cols === null) {
			$cols = array('jbcontractbudget_id','jbcontractbudget_amt','jbcontractbudget_amt_actual',
							'jbcontractbudget_amt_pnactual');
		}
		if ($useJobBudgets == '1') {
			$condition = "{$fromAlias}.jbcontract_id IS NULL";
		} else {
			$condition = "{$fromAlias}.jbcontract_id = {$toAlias}.jbcontract_id";
		}
		$condition .= "
			AND jb.jbjobcode_id = jbjc.jbjobcode_id 
			AND jb.jbcostcode_id = jbcc.jbcostcode_id 
			AND jb.jbphasecode_id = ISNULL(jbpc.jbphasecode_id, 0) 
			AND jb.jbchangeorder_id = ISNULL(jbco.jbchangeorder_id, 0)
		";
		$this->setTable(array($toAlias=>'jbcontractbudget'))
			->setCondition($condition)
			->setCols($cols)
			->setType($type);
	}
	
}