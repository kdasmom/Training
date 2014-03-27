<?php
namespace NP\workflow;

use NP\core\AbstractGateway;
use NP\core\db\Adapter;
use NP\core\db\Expression;
use NP\core\db\Select;
use NP\core\db\Delete;
use NP\core\db\Where;

class WFActionGateway extends AbstractGateway {
	protected $table = 'wfaction';

	public function copy($ruleid, $targetid) {
		$select = Select::get()
			->columns([
				new \NP\core\db\Expression($ruleid),
				'wfactiontype_id',
				'wfaction_originator_tablename',
				'wfaction_originator_tablekey_id',
				'wfaction_receipient_tablename',
				'wfaction_receipient_tablekey_id',
				'wfaction_nextlevel'
			])
			->from('wfaction')
			->where(
				Where::get()->equals('wfrule_id', $targetid)
			);

		$insert = \NP\core\db\Insert::get()
			->into($this->table)
			->columns([
				'wfrule_id',
				'wfactiontype_id',
				'wfaction_originator_tablename',
				'wfaction_originator_tablekey_id',
				'wfaction_receipient_tablename',
				'wfaction_receipient_tablekey_id',
				'wfaction_nextlevel'
			])
			->values($select);
		$this->adapter->query($insert);
	}


	public function GetRuleOriginators($wfruleid, $asp_client_id, $orderby='originator') {
		$select = new Select();

		$select->columns([
			'wfaction_receipient_tablename',
			'wfaction_receipient_tablekey_id',
			'wfaction_originator_tablename',
			'wfaction_originator_tablekey_id',
			'wfaction_id',
			'wfrule_id',
			'forwards' => new Expression("
				CASE
					WHEN wf.wfruletype_id = 15 THEN '---'
					WHEN w.wfaction_receipient_tablename='role' THEN 'Role'
					WHEN w.wfaction_receipient_tablename='userprofilerole' THEN 'User'
					ELSE 'Next Level'
					END
			"),
			'names' => new Expression("
				CASE
					WHEN wf.wfruletype_id = 15 THEN '---'
					WHEN w.wfaction_receipient_tablename='role' THEN r.role_name
					WHEN w.wfaction_receipient_tablename='userprofilerole'
						THEN
						(ISNULL(ps.person_lastname, '')+', '+ISNULL(ps.person_firstname, '')+' '+ISNULL(ps.person_middlename, '')) +
							CASE u.userprofile_status
								WHEN 'inactive' THEN ' (Inactive)'
								ELSE ''
							END
						ELSE '- -'
						END
			"),
			'originator' => new Expression("
				CASE
					WHEN w.wfaction_originator_tablename='role' THEN 'Role'
					WHEN w.wfaction_originator_tablename='userprofilerole' THEN 'User'
					ELSE '---'
					END
			"),
			'onames' => new Expression("
				CASE
					WHEN w.wfaction_originator_tablename='role' THEN (

					Select role_name FROM ROLE where role_id = w.wfaction_originator_tablekey_id)
					WHEN w.wfaction_originator_tablename='userprofilerole'
						THEN (
							Select ISNULL(PERSON.person_lastname, '')+', '+ISNULL(PERSON.person_firstname, '')+' '+ISNULL(PERSON.person_middlename, '')  +
								CASE userprofile_status
									WHEN 'inactive' THEN ' (Inactive)'
									ELSE ''
								END
							FROM
							USERPROFILEROLE
							INNER JOIN USERPROFILE u ON u.userprofile_id = USERPROFILEROLE.userprofile_id
							INNER JOIN STAFF ON USERPROFILEROLE.tablekey_id = STAFF.staff_id
							INNER JOIN PERSON ON STAFF.person_id = PERSON.person_id
							WHERE USERPROFILEROLE.userprofilerole_id = w.wfaction_originator_tablekey_id
							 )
					ELSE '---'
					END
			")
		])
		->from(['w' => 'wfaction'])
			->join(
				['r' => 'role'],
				'r.role_id=w.wfaction_receipient_tablekey_id and w.wfaction_receipient_tablename=\'role\'',
				['role_name'],
				Select::JOIN_LEFT_OUTER
			)
			->join(
				['ur' => 'userprofilerole'],
				'ur.userprofilerole_id=w.wfaction_receipient_tablekey_id and w.wfaction_receipient_tablename=\'userprofilerole\'',
				['userprofilerole_id'],
				Select::JOIN_LEFT_OUTER
			)
			->join(
				['u' => 'userprofile'],
				'u.userprofile_id=ur.userprofile_id and u.asp_client_id=' . $asp_client_id,
				[],
				Select::JOIN_LEFT_OUTER
			)
			->join(
				['s' => 'STAFF'],
				'ur.tablekey_id = s.staff_id',
				[],
				Select::JOIN_LEFT_OUTER
			)
			->join(
				['ps' => 'PERSON'],
				's.person_id = ps.person_id',
				[],
				Select::JOIN_LEFT_OUTER
			)
			->join(
				['wf' => 'WFRULE'],
				'w.wfrule_id = wf.wfrule_id',
				[],
				Select::JOIN_LEFT_OUTER
			);

		$where = Where::get()->equals('w.wfrule_id', $wfruleid);
		$select->where($where);
		$select->order($orderby);

		return $this->adapter->query($select);
	}


	public function DeleteRuleOriginator($wfactionid) {
		return $this->delete(['wfaction_id' => '?'], [$wfactionid]);
	}


	public function findOriginatorUserRolesConflicts($checkWfruleid, $wfrule_id_list, $originator_tablekey_id) {
		$select = new Select();
		$subselect = new Select();

		$subselect->columns(['userprofilerole_id'])
					->from(['upr' => 'userprofilerole'])
						->whereIn('upr.role_id', '?');

		$select->columns(['wfrule_id'])
				->from(['wfa' => 'wfaction'])
					->whereIn('wfa.wfaction_originator_tablekey_id', $subselect)
					->whereIn('wfa.wfrule_id', implode(',', $wfrule_id_list))
					->whereEquals('wfa.wfaction_originator_tablename', "'userprofilerole'")
					->whereNotEquals('wfa.wfrule_id', '?');

		$result = $this->adapter->query($select, [$originator_tablekey_id, $checkWfruleid]);

		$rulesIdList = [];
		foreach ($result as $item) {
			$rulesIdList[] = $item['wfrule_id'];
		}

		return $rulesIdList;
	}

	public function findOriginatorRolesConflicts($checkWfruleid, $wfrule_id_list, $originator_tablekey_id) {
		$select = new Select();

		$select->columns(['wfrule_id'])
				->from(['wfa' => 'wfaction'])
					->whereEquals('wfa.wfaction_originator_tablekey_id', $originator_tablekey_id)
					->whereIn('wfa.wfrule_id', implode(',', $wfrule_id_list))
					->whereEquals('wfa.wfaction_originator_tablename', "'role'")
					->whereNotEquals('wfa.wfrule_id', '?');

		$result = $this->adapter->query($select, [$originator_tablekey_id, $checkWfruleid]);

		$rulesIdList = [];
		foreach ($result as $item) {
			$rulesIdList[] = $item['wfrule_id'];
		}

		return $rulesIdList;
	}

	public function findOriginatorUserprofileConflicts($checkWfruleid, $wfrule_id_list, $originator_tablekey_id) {
		$select = new Select();

		$select->columns(['wfrule_id'])
				->from(['wfa' => 'wfaction'])
					->whereEquals('wfa.wfaction_originator_tablekey_id', '?')
					->whereIn('wfa.wfrule_id', implode(',', $wfrule_id_list))
					->whereEquals('wfa.wfaction_originator_tablename', "'userprofilerole'")
					->whereNotEquals('wfa.wfrule_id', '?');

		$result = $this->adapter->query($select, [$originator_tablekey_id, $checkWfruleid]);

		$rulesIdList = [];
		foreach ($result as $item) {
			$rulesIdList[] = $item['wfrule_id'];
		}

		return $rulesIdList;
	}
}