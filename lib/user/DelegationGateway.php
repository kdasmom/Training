<?php

namespace NP\user;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Adapter;
use NP\user\sql\UserprofileSelect;
use NP\core\db\Expression;

/**
 * Gateway for the DELEGATION table
 *
 * @author Thomas Messier
 */
class DelegationGateway extends AbstractGateway {
	
	protected $pk = 'Delegation_Id';

	protected $roleGateway;

	public function __construct(Adapter $adapter, RoleGateway $roleGateway) {
		$this->roleGateway = $roleGateway;

		parent::__construct($adapter);
	}

	/**
	 * Gets delegation to or from a user
	 *
	 * @param  int    $userprofile_id    ID of user in relation to whom you want delegations
	 * @param  int    $toOrFrom          Whether you want to get delegations to a user or from a user; valid values are "to" or "from"
	 * @param  int    $delegation_status Retrieve only records with a specific delegation_status (optional); default is null, 1 and 0 are other valid values
	 * @param  int    $pageSize          The number of records per page; if null, all records are returned
	 * @param  int    $page              The page for which to return records
	 * @param  string $sort              Field(s) by which to sort the result; defaults to delegation_startdate
	 * @return array
	 */
	public function findUserDelegations($userprofile_id, $toOrFrom, $delegation_status=null, $pageSize=null, $page=1, $sort='delegation_startdate') {
		if ($toOrFrom != 'to' && $toOrFrom != 'from') {
			throw new \NP\core\Exception("The value of the \$toOrFrom argument, '{$toOrFrom}', is invalid. It must be either 'to' or 'from'.");
		}

		$select = new Select();

		if ($toOrFrom == 'from') {
			$whereField = 'UserProfile_Id';
		} else if ($toOrFrom == 'to') {
			$whereField = 'Delegation_To_UserProfile_Id';
		} else {
			throw new \NP\core\Exception("Invalid argument \$toOrFrom. Valid values for \$toOrFrom are 'to' and 'from'. Current value is '{$toOrFrom}'");
		}

		$select->columns(array(
					'Delegation_Id',
					'UserProfile_Id',
					'Delegation_To_UserProfile_Id',
					'Delegation_StartDate',
					'Delegation_StopDate',
					'Delegation_Status',
					'Delegation_CreatedDate',
					'delegation_createdby',
					'delegation_status_name' => new Expression("
						CASE
							WHEN d.Delegation_Status = 1 THEN
								CASE
									WHEN d.Delegation_StartDate <= getDate() AND d.Delegation_StopDate > getDate() THEN 'Active'
									WHEN d.Delegation_StartDate > getDate() THEN 'Future'
									ELSE 'Expired'
								END
							ELSE 'Inactive'
						END
					")
				))
				->from(array('d'=>'delegation'))
				->join(array('u'=>'userprofile'),
						"d.userprofile_id = u.userprofile_id",
						array('userprofile_username'))
				->join(array('ur'=>'userprofilerole'),
						"u.userprofile_id = ur.userprofile_id",
						array('role_id'))
				->join(array('s'=>'staff'),
						"ur.tablekey_id = s.staff_id",
						array())
				->join(array('p'=>'person'),
						"s.person_id = p.person_id",
						array('person_firstname','person_lastname'))
				->join(array('u2'=>'userprofile'),
						"d.delegation_to_userprofile_id = u2.userprofile_id",
						array('delegation_to_userprofile_username'=>'userprofile_username'))
				->join(array('ur2'=>'userprofilerole'),
						"u2.userprofile_id = ur2.userprofile_id",
						array('delegation_to_role_id'=>'role_id'))
				->join(array('s2'=>'staff'),
						"ur2.tablekey_id = s2.staff_id",
						array())
				->join(array('p2'=>'person'),
						"s2.person_id = p2.person_id",
						array('delegation_to_person_firstname'=>'person_firstname','delegation_to_person_lastname'=>'person_lastname'))
				->join(array('u3'=>'userprofile'),
						"d.delegation_createdby = u3.userprofile_id",
						array('delegation_createdby_userprofile_username'=>'userprofile_username'),
						Select::JOIN_LEFT)
				->join(array('ur3'=>'userprofilerole'),
						"u3.userprofile_id = ur3.userprofile_id",
						array('delegation_createdby_role_id'=>'role_id'),
						Select::JOIN_LEFT)
				->join(array('s3'=>'staff'),
						"ur3.tablekey_id = s3.staff_id",
						array(),
						Select::JOIN_LEFT)
				->join(array('p3'=>'person'),
						"s3.person_id = p3.person_id",
						array('delegation_createdby_person_firstname'=>'person_firstname','delegation_createdby_person_lastname'=>'person_lastname'),
						Select::JOIN_LEFT)
				->whereEquals("d.{$whereField}", '?')
				->order($sort);

		$params = array($userprofile_id);

		if ($delegation_status !== null) {
			if ($delegation_status == 1) {
				$select->whereEquals('d.delegation_status', '?')
						->whereLessThanOrEqual('d.delegation_startdate', '?')
						->whereGreaterThan('d.delegation_stopdate', '?');
			} else if ($delegation_status == 0) {
				$select->whereNest('OR')
					    ->whereEquals('d.delegation_status', '?')
						->whereGreaterThan('d.delegation_startdate', '?')
						->whereLessThanOrEqual('d.delegation_stopdate', '?');
			}
			$now = \NP\util\Util::formatDateForDB();
			array_push($params, $delegation_status, $now, $now);
		}

		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, $params, $pageSize, $page);
		} else {
			return $this->adapter->query($select, $params);
		}
	}
	
	public function findAllowedDelegationUsers($userprofile_id) {
		$role = $this->roleGateway->findByUser($userprofile_id);
		$role_id = $role['role_id'];
		$roleUp = $this->roleGateway->getNextLevelUp($role_id);
		$next_role_id = $roleUp['role_id'];

		$now = \NP\util\Util::formatDateForDB();

		$select1 = new UserprofileSelect();

		$delegSubSelect = new Select();
		$select1->columns(array('userprofile_id','userprofile_username'))
				->joinUserprofilerole()
				->joinRole(array('role_id','role_name'))
				->joinStaff()
				->joinPerson(array('person_firstname','person_lastname'))
				->whereEquals('r.role_name', "'Administrator'")
				->whereNotEquals('u.userprofile_id', '?')
				->whereNotExists(
					$delegSubSelect->from(array('d'=>'delegation'))
									->whereEquals('d.delegation_to_userprofile_id', 'ur.userprofile_id')
									->whereEquals('d.userprofile_id', '?')
									->whereEquals('d.delegation_status', '1')
									->whereLessThanOrEqual('d.delegation_startdate', '?')
									->whereGreaterThan('d.delegation_stopdate', '?')
				);
		$params = array($userprofile_id, $userprofile_id, $now, $now);


		$select2 = new UserprofileSelect();
		$select2->distinct()
				->columns(array())
				->from(array('w'=>'wfrule'))
				->join(array('wt'=>'wfruletype'),
						'w.wfruletype_id = wt.wfruletype_id',
						array())
				->join(array('wa'=>'wfaction'),
						'w.wfrule_id = wa.wfrule_id',
						array())
				// Not doing the abstracted subqueries here for simplicity sake
				->join(array('ur'=>'userprofilerole'),
						"(wa.wfaction_receipient_tablename = 'role' AND ur.userprofilerole_id IN (
								SELECT userprofilerole_id FROM userprofilerole WHERE role_id = wa.wfaction_receipient_tablekey_id 
							))
						OR (
							wa.wfaction_receipient_tablename = 'userprofilerole' AND ur.userprofilerole_id = wa.wfaction_receipient_tablekey_id
						)
						OR (
							wa.wfaction_nextlevel = 'Y' AND ur.userprofilerole_id IN (
								SELECT userprofilerole_id FROM userprofilerole WHERE role_id = ?
							)
						)",
						array())
				->join(array('u'=>'userprofile'),
						'ur.userprofile_id = u.userprofile_id',
						array('userprofile_id','userprofile_username'))
				->joinRole(array('role_id','role_name'))
				->joinStaff()
				->joinPerson(array('person_firstname','person_lastname'))
				->whereEquals('wt.wfruletype_name', "'Delegation'")
				->whereEquals('u.userprofile_status', "'active'")
				->whereNotEquals('u.userprofile_id', '?')
				->exists("
					SELECT *
					FROM propertyuserprofile pu
					WHERE pu.userprofile_id = ?
						AND pu.property_id IN (SELECT tablekey_id FROM wfruletarget wft WHERE wft.wfrule_id = w.wfrule_id AND wft.table_name = 'property')
				")
				->exists("
					SELECT *
					FROM propertyuserprofile pu
					WHERE pu.userprofile_id = ur.userprofile_id
						AND pu.property_id IN (SELECT tablekey_id FROM wfruletarget wft WHERE wft.wfrule_id = w.wfrule_id AND wft.table_name = 'property')
				")
				->notExists("
					SELECT *
					FROM delegation d
					WHERE d.userprofile_id = ur.userprofile_id
						AND d.delegation_status = 1
						AND d.delegation_startdate <= ?
						AND d.delegation_stopdate > ?
				")
				->notExists("
					SELECT *
					FROM delegation d
					WHERE d.delegation_to_userprofile_id = ur.userprofile_id
						AND d.userprofile_id = ?
						AND d.delegation_status = 1
						AND d.delegation_startdate <= ?
						AND d.delegation_stopdate > ?
				")
				->whereExpression("(
					(wa.wfaction_originator_tablename = 'role' AND wa.wfaction_originator_tablekey_id = ?)
					OR (wa.wfaction_originator_tablename = 'userprofilerole' AND wa.wfaction_originator_tablekey_id = (
						SELECT userprofilerole_id FROM userprofilerole WHERE userprofile_id = ?
					))
				)")
				->order('p.person_lastname');

		// Add parameters for the second query
		array_push($params, $next_role_id, $userprofile_id, $userprofile_id, $now, $now, $userprofile_id, $now, $now, $role_id, $userprofile_id);

		$sql = $select1->toString() . ' UNION ALL ' . $select2->toString();

		return $this->adapter->query($sql, $params);
	}

}

?>