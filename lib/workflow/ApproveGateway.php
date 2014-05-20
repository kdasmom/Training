<?php

namespace NP\workflow;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Expression;
use NP\property\sql\PropertyFilterSelect;
use NP\property\PropertyContext;

/**
 * Gateway for the APPROVE table
 *
 * @author Thomas Messier
 */
class ApproveGateway extends AbstractGateway {
	protected $tableAlias = 'a';

	public function getSelect() {
		return Select::get()->from([$this->tableAlias=>'approve'])
							->join(new sql\join\ApproveApproveTypeJoin(null));
	}

	/**
	 * Checks if a certain PO or Invoice has had a master rule approved
	 */
	public function hasMasterRuleApproval($table_name, $tablekey_id) {
		$select = $this->getSelect()
						->count(true, 'total')
							->join(new sql\join\ApproveRuleJoin([], Select::JOIN_INNER))
							->join(new sql\join\WfRuleWfRuleTypeJoin([]))
						->whereEquals('a.table_name', '?')
						->whereEquals('a.tablekey_id', '?')
						->whereEquals('wrt.ismaster', 1)
						->whereNotExists(
							Select::get()
								->from(['a2'=>'approve'])
									->join(new sql\join\ApproveApproveTypeJoin([], Select::JOIN_INNER, 'at2', 'a2'))
								->whereEquals('a.wfrule_id', 'a2.wfrule_id')
								->whereEquals('a.table_name', 'a2.table_name')
								->whereEquals('a.tablekey_id', 'a2.tablekey_id')
								->whereEquals('at2.approvetype_name', "'rejected'")
								->whereLessThan('a.approve_datetm', 'a2.approve_datetm')
						);

		$res = $this->adapter->query($select, [$table_name, $tablekey_id]);

		return ($res[0]['total'] > 0);
	}

	/**
	 * Finds all approve records that are approvable by a given user
	 */
	public function findApprovableRecords($table_name, $tablekey_id, $userprofile_id, $delegation_to_userprofile_id) {
		$propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegation_to_userprofile_id, 'all', null));

		$select = $this->getSelect()
						->whereEquals('a.table_name', '?')
						->whereEquals('a.tablekey_id', '?')
						->whereMerge(
							new \NP\shared\sql\criteria\IsApproverCriteria(
								$table_name,
								$userprofile_id,
								$propertyFilterSelect,
								false
							)
						);

		return $this->adapter->query($select, [$table_name, $tablekey_id]);
	}

	/**
	 * Finds items that can be auto approved for an entity
	 */
	public function findAutoApprovers($table_name, $tablekey_id) {
		$routes = $this->find(
			[
				'a.table_name' => '?',
				'a.tablekey_id' => '?',
				'a.approve_status' => "'active'",
				'at.approvetype_name' => "'submitted'"
			],
			[$table_name, $tablekey_id]
		);

		$autoApprovers = [];
		$firstSubmitter = $this->findFirstSubmitter($table_name, $tablekey_id);
		foreach ($routes as $route) {
			$approve = new ApproveEntity($route);
			$approvers = $this->getExistingApprovers($approve, $firstSubmitter);

			foreach ($approvers as $userprofile_id=>$delegation_to_userprofile_id) {
				if (!array_key_exists($userprofile_id, $autoApprovers)) {
					$autoApprovers[$userprofile_id] = $delegation_to_userprofile_id;
				}
			}
		}

		return $autoApprovers;
	}

	private function getExistingApprovers(ApproveEntity $approve, $firstSubmitter) {
		if (
			(
				$approve->forwardto_tablename == 'role'
				&& $approve->forwardto_tablekeyid == $firstSubmitter['role_id']
			)
			|| (
				$approve->forwardto_tablename == 'userprofilerole'
				&& $approve->forwardto_tablekeyid == $firstSubmitter['userprofilerole_id']
			)
		) {
			return [
				[
					'userprofile_id'               => $firstSubmitter['userprofile_id'],
					'delegation_to_userprofile_id' => $firstSubmitter['userprofile_id']
				]
			];
		}

		$select = $this->getSelect()
					->columns(['userprofile_id','delegation_to_userprofile_id'])
					->join(
						['ur'=>'userprofilerole'],
						'a.userprofile_id = ur.userprofile_id',
						[]
					)
					->whereEquals('a.table_name', '?')
					->whereEquals('a.tablekey_id', '?')
					->whereEquals('at.approvetype_name', "'approved'")
					->whereMerge($this->getApproveIdCondition());

		if ($approve->forwardto_tablename == 'role') {
			$select->whereEquals('ur.role_id', '?');
		} else {
			$select->whereEquals('ur.userprofilerole_id', '?');
		}

		return $this->adapter->query($select, [
			$approve->table_name,
			$approve->tablekey_id,
			$approve->table_name,
			$approve->tablekey_id,
			$approve->forwardto_tablekeyid
		]);
	}

	public function findFirstSubmitter($table_name, $tablekey_id) {
		$select = $this->getSelect()
					->column('userprofile_id')
						->join(
							['ur'=>'userprofilerole'],
							'a.userprofile_id = ur.userprofile_id',
							['userprofilerole_id','role_id']
						)
					->whereEquals('a.table_name', '?')
					->whereEquals('a.tablekey_id', '?')
					->whereEquals('at.approvetype_name', "'submitted'")
					->whereMerge($this->getApproveIdCondition())
					->order('a.approve_datetm ASC')
					->limit(1);

		$res = $this->adapter->query($select, [$table_name, $tablekey_id, $table_name, $tablekey_id]);

		if (count($res)) {
			return $res[0];
		}

		return null;
	}

	private function getApproveIdCondition() {
		return Where::get()->greaterThan(
			'approve_id',
			Select::get()
				->column(new Expression('ISNULL(MAX(a.approve_id), 0)'))
				->from([$this->tableAlias=>'approve'])
				->join(new sql\join\ApproveApproveTypeJoin([]))
				->whereEquals('a.table_name', '?')
				->whereEquals('a.tablekey_id', '?')
				->whereIn('at.approvetype_name', "'rejected','modified'")
		);
	}

	/**
	 * Checks if an entity has any outstanding workflows awaiting approval
	 */
	public function hasPendingApprovals($table_name, $tablekey_id) {
		$res = $this->find(
			[
				'a.table_name'        => '?',
				'a.tablekey_id'       => '?',
				'a.approve_status'    => "'active'",
				'at.approvetype_name' => "'submitted'"
			],
			[$table_name, $tablekey_id]
		);

		return (count($res) > 0);
	}
}

?>