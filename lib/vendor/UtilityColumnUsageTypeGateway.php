<?php

namespace NP\vendor;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the UTILITYCOLUMNUSAGETYPE table
 *
 * @author Thomas Messier
 */
class UtilityColumnUsageTypeGateway extends AbstractGateway {
	protected $table = 'utilitycolumn_usagetype';

	/**
	 * Returns a list of usage types that match the utility type for the account selected
	 */
	public function findByUtilityAccount($utilityaccount_id) {
		$select = Select::get()->columns([])
								->from(['ua'=>'utilityaccount'])
								->join(new sql\join\UtilityAccountUtilityJoin([]))
								->join(new sql\join\UtilityUtilityTypeJoin([]))
								->join(new sql\join\UtilityTypeUtilityColumnUsageTypeJoin())
								->whereEquals('ua.utilityaccount_id', '?')
								->order('UtilityColumn_UsageType_Name');

		return $this->adapter->query($select, [$utilityaccount_id]);
	}
}

?>