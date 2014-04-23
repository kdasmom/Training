<?php

namespace NP\jobcosting\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from JBJOBASSOCIATION to JBCONTRACTBUDGET table
 *
 * @author Thomas Messier
 */
class JobAssociationJbContractBudgetJoin extends Join {
	
	public function __construct($cols=array('jbcontractbudget_id','jbcontractbudget_amt','jbcontractbudget_amt_actual','jbcontractbudget_amt_pnactual'), $type=Select::JOIN_LEFT, $toAlias='jbctb', $fromAlias='jb') {
		$this->setTable(array($toAlias=>'jbcontractbudget'))
			->setCondition("
				ISNULL({$fromAlias}.jbcontract_id, 0) = ISNULL({$toAlias}.jbcontract_id, 0)
				AND ISNULL({$fromAlias}.jbchangeorder_id, 0) = ISNULL({$toAlias}.jbchangeorder_id, 0)
				AND ISNULL({$fromAlias}.jbjobcode_id, 0) = ISNULL({$toAlias}.jbjobcode_id, 0)
				AND ISNULL({$fromAlias}.jbphasecode_id, 0) = ISNULL({$toAlias}.jbphasecode_id, 0)
				AND ISNULL({$fromAlias}.jbcostcode_id, 0) = ISNULL({$toAlias}.jbcostcode_id, 0)
			")
			->setCols($cols)
			->setType($type);
	}
	
}