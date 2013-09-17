<?php

namespace NP\shared\sql\criteria;

use NP\core\db\Where;
use NP\core\db\Select;
use NP\property\sql\PropertyFilterSelect;
use NP\property\PropertyContext;

/**
 * Approver filter for Property table
 *
 * @author Thomas Messier
 */
class IsApproverCriteria extends Where {
	
	/**
	 * @param  boolean $isAdmin
	 */
	public function __construct($entityType, $userprofile_id, $propertySelect=null, $isAdmin=false) {
		parent::__construct();

		if ($entityType == 'purchaseorder') {
			$lineTable = 'poitem';
		} else if ($entityType == 'receipt') {
			$lineTable = 'rctitem';
		} else {
			$lineTable = "{$entityType}item";
		}
		$tableAlias = substr($entityType, 0, 1);
		$lineTableAlias = $tableAlias . 'i';
		
		if ($propertySelect === null) {
			$propertySelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $userprofile_id, 'all', null));
		}

		$this->equals('a.approvetype_id', 1)
					->equals('a.approve_status', "'active'")
					->nest('OR')
					->isNull('a.wftarget_id')
					->in(
						Select::get()->from(array('wft'=>'WFRULETARGET'))
									->column('tablekey_id')
									->where("
										wft.wfruletarget_id = a.wftarget_id 
										AND wft.table_name = 'property'
									"),
						$propertySelect)
					->unnest();

		if ($isAdmin) {
			$this->nest('OR')
				->exists(Select::get()->from(array($lineTableAlias=>$lineTable))
									->whereEquals("{$lineTableAlias}.{$entityType}_id", "{$tableAlias}.{$entityType}_id")
									->whereIn("{$lineTableAlias}.property_id", $propertySelect))
				->in("{$tableAlias}.property_id", $propertySelect)
				->unnest();
		} else {
			$this->nest('OR')
				->nest()
				->equals(
					'a.forwardto_tablekeyid',
					Select::get()->column('role_id')
								->from(array('ur'=>'userprofilerole'))
								->whereEquals('userprofile_id', $userprofile_id)
				)
				->equals('a.forwardto_tablename', "'role'")
				->unnest()
				->nest()
				->equals(
					'a.forwardto_tablekeyid',
					Select::get()->column('userprofilerole_id')
								->from(array('ur'=>'userprofilerole'))
								->whereEquals('userprofile_id', $userprofile_id)
				)
				->equals('a.forwardto_tablename', "'userprofilerole'")
				->unnest()
				->unnest();
		}
	}
	
}