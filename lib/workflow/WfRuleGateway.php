<?php

namespace NP\workflow;

use NP\core\AbstractGateway;
use NP\core\db\Adapter;
use NP\core\db\Select;
use NP\user\UserprofileRoleGateway;

/**
 * Gateway for the WFRULE table
 *
 * @author 
 */
class WfRuleGateway extends AbstractGateway {
	protected $userprofileRoleGateway;

	public function __construct(Adapter $adapter, UserprofileRoleGateway $userprofileRoleGateway) {
		$this->userprofileRoleGateway = $userprofileRoleGateway;
		
		parent::__construct($adapter);
	}

	/**
	 * Checks to see if there's an active optional workflow rule for the current property and user 
	 *
	 * @param  int     $property_id
	 * @param  int     $userprofile_id
	 * @return boolean
	 */
	public function hasOptionalRule($property_id, $userprofile_id) {
		$user = $this->userprofileRoleGateway->find(
			'userprofile_id = ?',
			[$userprofile_id],
			null,
			['userprofilerole_id','role_id']
		);

		$res = $this->adapter->query(
			Select::get()->count(true, 'ruleCount')
						->from(['wr'=>'wfrule'])
						->join(new sql\join\WfRuleWfRuleTypeJoin([]))
						->join(new sql\join\WfRuleWfActionJoin())
						->join(new sql\join\WfRuleWfRuleTargetJoin())
						->whereEquals('wr.wfrule_status', "'active'")
						->whereEquals('wrt.wfruletype_name', "'Optional Workflow'")
						->whereEquals('wrta.tablekey_id', '?')
						->whereNest('OR')
							->whereNest()
								->whereEquals('wa.wfaction_originator_tablename', "'userprofilerole'")
								->whereEquals('wa.wfaction_originator_tablekey_id', '?')
							->whereUnnest()
							->whereNest()
								->whereEquals('wa.wfaction_originator_tablename', "'role'")
								->whereEquals('wa.wfaction_originator_tablekey_id', '?')
							->whereUnnest()
						->whereUnnest(),
			[$property_id, $user[0]['userprofilerole_id'], $user[0]['role_id']]
		);

		return ($res[0]['ruleCount']) ? true : false;
	}

}

?>