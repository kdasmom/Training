<?php

namespace NP\workflow\sql;

use NP\core\db\Select;
use NP\core\db\Expression;

/**
 * A custom Select object for APPROVE records with some shortcut methods
 *
 * @author Thomas Messier
 */
class ApproveSelect extends Select {
	
	public function __construct() {
		parent::__construct();
		$this->from(['a'=>'approve']);
	}

	/**
	 * 
	 */
	public function addHistoryLogSpecification() {
		$nullExp = new Expression('NULL');

		return $this->columns([
			'approve_id',
			'approve_datetm',
			new Expression("
				CASE
					WHEN a.auto_approve = 1 THEN 'AUTO-APPROVED'
					ELSE at.approvetype_name 
				END AS approvetype_name
			"),
			new Expression("
				CASE
					WHEN wr.wfrule_name = 'Budget Overage' THEN wr.wfrule_name + ':' + a.approve_message + ' (GL ' + CONVERT(varchar(32), g.glaccount_number)  + ')' 
					WHEN wr.wfrule_name IS NULL THEN approve_message
					ELSE
						wr.wfrule_name + ' Workflow rule applied for ' + wrt.wfruletype_name +
							CASE
								WHEN a.approve_message LIKE '%on behalf%' THEN ' ' + a.approve_message
								ELSE ''
							END
				END + CASE
						WHEN a.approve_message LIKE '%on behalf%' THEN ''
						WHEN a.userprofile_id <> ISNULL(a.delegation_to_userprofile_id, 0) 
							AND a.userprofile_id IS NOT NULL 
							AND a.delegation_to_userprofile_id IS NOT NULL THEN
								' (done by ' + ud.userprofile_username + ' on behalf of ' + u.userprofile_username + ')'
						ELSE ''
					END AS message
			"),
			new Expression('u.userprofile_username'),
			'forwardto_tablename',
			'forwardto_tablekeyid',
			new Expression('g.glaccount_number'),
			new Expression("
				CASE 
					WHEN a.forwardto_tablename = 'role' THEN (
						SELECT role_name
			        	FROM ROLE
						WHERE role_id = forwardto_tablekeyid
					) 
					ELSE (
						SELECT p.person_firstname + ' ' + p.person_lastname
						FROM USERPROFILE u
							INNER JOIN userprofilerole ur ON u.userprofile_id = ur.userprofile_id
							INNER JOIN role r ON ur.role_id = r.role_id
							INNER JOIN staff s ON ur.tablekey_id = s.staff_id
							INNER JOIN person p ON s.person_id = p.person_id
						WHERE r.table_name = 'staff'
							AND ur.userprofilerole_id = a.forwardto_tablekeyid
					) 
				END	AS approver
			"),
			'transaction_id'
		])
		->join(new join\ApproveApproveTypeJoin([]))
		->join(new join\ApproveUserJoin([]))
		->join(new join\ApproveDelegationUserJoin([]))
		->join(new join\ApproveRuleJoin([]))
		->join(new join\WfRuleWfRuleTypeJoin([], Select::JOIN_LEFT))
		->join(new join\ApproveBudgetJoin([]))
		->join(new \NP\gl\sql\join\BudgetGlAccountJoin([], Select::JOIN_LEFT))
		->whereEquals('a.table_name', '?')
		->whereEquals('a.tablekey_id', '?');
	}

}

?>