<?php
namespace NP\workflow\sql;

use NP\core\db\Select;

class WfActionOriginatorSelect extends Select {
	public function __construct($wfrule_id) {
		parent::__construct();

		$this->from(['wa'=>'wfaction'])
			->whereEquals('wa.wfrule_id', $wfrule_id)
			->whereNest('OR')
				->whereNest('AND')
					->whereEquals('wa.wfaction_originator_tablename', "'role'")
					->whereEquals(
						'wa.wfaction_originator_tablekey_id',
						Select::get()
							->column('role_id')
							->from('userprofilerole')
							->whereEquals('userprofile_id', '?')
					)
				->whereUnnest()
				->whereNest('AND')
					->whereEquals('wa.wfaction_originator_tablename', "'userprofilerole'")
					->whereEquals(
						'wa.wfaction_originator_tablekey_id',
						Select::get()
							->column('userprofilerole_id')
							->from('userprofilerole')
							->whereEquals('userprofile_id', '?')
					)
				->whereUnnest()
			->whereUnnest();
	}
}

?>