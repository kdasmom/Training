<?php

namespace NP\workflow;

use NP\core\AbstractGateway;
use NP\core\db\Adapter;
use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Update;
use NP\core\db\Expression;
use NP\user\UserprofileRoleGateway;
use NP\vendor\VendorGateway;

/**
 * Gateway for the WFRULE table
 *
 * @author 
 */
class WfRuleGateway extends AbstractGateway {
	const NUMBER_TYPE_PERCENTAGE = "percentage";
	const NUMBER_TYPE_ACTUAL = "actual";
	const NUMBER_TYPE_USER_PRIVILEGES = "the privileges of current user";

	const NO_CRITERIA = 0;
	const PROPERTY_CRITERIA = 1;
	const GLACCOUNTS_CRITERIA = 2;
	const USERS_CRITERIA = 3;
	const ROLES_CRITERIA = 4;
	const VENDORS_CRITERIA = 5;
	const RULETYPE_CRITERIA = 6;

	protected $pk = 'wfrule_id';
	protected $table = 'wfrule';

	protected $userprofileRoleGateway, $vendorGateway, $wfActionGateway;

	public function __construct(Adapter $adapter, UserprofileRoleGateway $userprofileRoleGateway, VendorGateway $vendorGateway, WFActionGateway $wfActionGateway) {
		$this->userprofileRoleGateway = $userprofileRoleGateway;
		$this->vendorGateway = $vendorGateway;
		$this->wfActionGateway = $wfActionGateway;
		
		parent::__construct($adapter);
	}

	/**
	 * Checks to see if there's an active optional workflow rule for the current property and user 
	 *
	 * @param  int	 $property_id
	 * @param  int	 $userprofile_id
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

	public function findRule($asp_client_id, $type, $criteria = [], $page, $size, $order) {
		if (!empty($criteria) && !is_array($criteria)) {
			$criteria = [ $criteria ];
		}
		else if (empty($criteria)) {
			$criteria = [];
		}

		$select = $this->setSearchCriteriaSelect($type, $asp_client_id, $criteria, $order);

		$countPropertiesResult = $this->adapter->query(
			new \NP\property\sql\GetPropertiesCountSelect($asp_client_id)
		);
		$countProperties = $countPropertiesResult[0]['count'];

		$result = [];
		if (!empty($size)) {
			$result = $this->getPagingArray($select, [], $size, $page, 'wf.wfrule_id');

		} else {
			$result = $this->adapter->query($select);
		}

		foreach ($result['data'] as &$item) {
			$item['all_properties_selected'] = ($item['count_properties'] == $countProperties) ? true : false;
		}

		return $result;
	}

	public function getRuleData($ruleid, $asp_client_id) {
		return $this->adapter->query(
			new sql\GetRuleSelect($ruleid, $asp_client_id)
		);
	}

	public function getRule($ruleid, $asp_client_id, $params = []) {
		$result = [
			'rule' => $this->adapter->query(
				new sql\GetRuleSelect($ruleid, $asp_client_id)
			),
			'scope' => $this->adapter->query(
				new sql\GetRuleScopeSelect($ruleid, $asp_client_id)
			),
			'routes' => $this->adapter->query(
				new sql\GetRuleRoutesSelect($ruleid, $asp_client_id)
			),
			'actions' => $this->adapter->query(
				new sql\GetRuleActionsSelect($ruleid, $asp_client_id)
			),
			'properties' => [],
			'tablekey_list_id' => []
		];


		if (!empty($result['rule']) && !empty($result['rule'][0])) {
			$result['rule'] = $result['rule'][0];

			$countPropertiesResult = $this->adapter->query(
				new \NP\property\sql\GetPropertiesCountSelect($asp_client_id)
			);
			$countProperties = $countPropertiesResult[0]['count'];

			$properties = $this->adapter->query( new sql\GetRulePropertiesSelect($ruleid) );
			$selected = 0;
			$property_list_id = [];
			foreach ($properties as $property) {
				$selected++;
				$property_list_id[] = $property['property_id'];
			}

			$result['properties'] = [
				'all' => $countProperties == $selected,
				'property_list_id' => $property_list_id,
				'properties' => $properties
			];

			$keys = [];
			foreach ($result['scope'] as $scope) {
				$keys[] = $scope['tablekey_id'];
			}
			if (empty($keys)) {
				$keys = [0];
			}

			$type = $result['rule']['wfruletype_id'];

//			if ($result['rule']['wfrule_status'] != 'new') {
//				$result['rule']['originator'] = $this->adapter->query(
//					new sql\GetRuleOriginatorSelect($ruleid, $asp_client_id, $type)
//				);
//			}

//			if (in_array($type, [3, 7, 8, 13, 29, 31, 33, 37])) {
//				$result['codes'] = $this->adapter->query(
//					new sql\GLAccountByWFRuleSelect($ruleid, $asp_client_id)
//				);
//			}
			if (in_array($type, [35, 36])) {
				$result['units'] = $this->adapter->query(
					new \NP\property\sql\GetUnitsSelect($keys)
				);

				if (!empty($result['units'])) {
					for ($i = 0; $i < count($result['units']); $i++) {
						$result['units'][$i]['unitcode'] =
							!empty($params) &&
								!empty($params['UnitAttachDisplay']) &&
								$params['UnitAttachDisplay'] == 'unitcode'
						;

						if ($result['units'][$i]['building_id_alt'] != '') {
							$result['units'][$i]['unit_display'] = strtoupper(
								$result['units'][$i]['building_id_alt']
								.' - '.
								$result['units'][$i]['unit_number']
							);
						} else {
							$result['units'][$i]['unit_display'] = strtoupper(
								$result['units'][$i]['unit_number']
							);
						}
					}
				}
			}
			if (in_array($type, [21,22])) {
				$scope = $result['scope'];

				$tablekey_list_id = [];
				foreach ($scope as $item) {
					$tablekey_list_id[] = $item['tablekey_id'];
				}

				$result['tablekey_list_id'] = $tablekey_list_id;
			}
			if (in_array($type, [6,16,28,35,36])) {
				$jobcodes = $result['scope'];

				$tablekey_list_id = [];
				foreach ($jobcodes as $jobcode) {
					$tablekey_list_id[] = $jobcode['tablekey_id'];
				}

				$result['jobcodes'] = $jobcodes;
				$result['tablekey_list_id'] = $tablekey_list_id;
			}
			if (in_array($type, [9, 10, 11, 12, 14, 30, 32, 34, 38])) {
				$glaccounts = $this->adapter->query(
					new sql\GLAccountByWFRuleSelect($ruleid, $asp_client_id)
				);
				$glaccount_list_id = [];
				foreach ($glaccounts as $glaccount) {
					$glaccount_list_id[] = $glaccount['glaccount_id'];
				}

				$result['categories'] = $glaccounts;
				$result['tablekey_list_id'] = $glaccount_list_id;
			}
			if (in_array($type, [24, 25, 26, 27])) {
				$contracts = $this->adapter->query(
					new sql\JobContractByWFRuleScope($ruleid)
				);

				$contract_list_id = [];
				foreach ($contracts as $contract) {
					$contract_list_id[] = $contract['jbcontract_id'];
				}

				$result['contracts'] = $contracts;
				$result['tablekey_list_id'] = $contract_list_id;
			}
			if (in_array($type, [6, 16])) {
				$where = Where::get()->in('v.vendor_id', implode(',', $keys));
				$vendors = $this->vendorGateway->find($where, [], null, ['vendor_id', 'vendor_name']);

//				$vendor_list_id = [];
				foreach ($vendors as $vendor) {
//					$vendor_list_id[] = $vendor['vendor_id'];
					$result['vendors'][$vendor['vendor_id']] = $vendor['vendor_name'];
				}

//				$result['tablekey_list_id'] = $vendor_list_id;
			}

			if ($type == 4) {
				$result['routes'] = [];
			}

			for ($i = 0; $i < count($result['routes']); $i++) {
				switch ($result['routes'][$i]['wfaction_receipient_tablename']) {
					case 'role':
						$result['routes'][$i]['forwards'] = 'Role';
						$result['routes'][$i]['names'] = $result['routes'][$i]['role_name'];
						break;
					case 'userprofilerole':
						$result['routes'][$i]['forwards'] = 'User';
						$result['routes'][$i]['names'] = 
							$result['routes'][$i]['person_lastname'].', '.
							$result['routes'][$i]['person_firstname'].' '.
							$result['routes'][$i]['person_middlename']
						;
						if ($result['routes'][$i]['userprofile_status'] == 'inactive') {
							$result['routes'][$i]['names'] .= ' (Inactive)';
						}
						break;
					default:
						$result['routes'][$i]['forwards'] = 'Next Level';
						$result['routes'][$i]['names'] = '- -';
				}

				switch ($result['routes'][$i]['wfaction_originator_tablename']) {
					case 'role':
						$result['routes'][$i]['originator'] = 'Role';
						$result['routes'][$i]['onames'] = $result['routes'][$i]['role_name_originator'];
						break;
					case 'userprofilerole':
						$result['routes'][$i]['originator'] = 'User';
						$result['routes'][$i]['onames'] = 
							$result['routes'][$i]['person_lastname_originator'].', '.
							$result['routes'][$i]['person_firstname_originator'].' '.
							$result['routes'][$i]['person_middlename_originator']
						;
						if ($result['routes'][$i]['userprofile_status_originator'] == 'inactive') {
							$result['routes'][$i]['onames'] .= ' (Inactive)';
						}
						break;
					default:
						$result['routes'][$i]['originator'] = '---';
				}
			}
		}
		return $result;
	}

	public function getRuleHours($ruleid, $asp_client_id) {
		$select = new sql\GetRuleHoursSelect($ruleid, $asp_client_id);
		return $this->adapter->query($select);
	}

	public function getRuleProperties($ruleid) {
		$select = new sql\GetRulePropertiesSelect($ruleid);
		return $this->adapter->query($select);
	}

	public function getUnits($unitid = null, $propertyid = null) {
		$select = new \NP\property\sql\GetUnitsSelect($unitid, $propertyid);

		return $this->adapter->query($select);
	}

	public function setRuleStatus($id, $status) {
		if ($status == 1) {
			$where = Where::get()->equals('wfrule_id', $id);
			$routes = $this->wfActionGateway->find($where);
			$status = count($routes)>0 ? 'active' : 'new';
		} elseif ($status == 3) {
			$status = 'inactive';
		} else {
			$status = 'deactive';
		}

		$update = new Update();
		$update->table($this->table)
				->value('wfrule_status', '\''.$status.'\'')
				->whereEquals('wfrule_id', new \NP\core\db\Expression($id));

		return $this->adapter->query($update);
	}


	/**
	 * Find count duplicate rules
	 *
	 * @param  int $wfrule_id
	 * @param  int $ruletypeid
	 * @param  int $asp_client_id
	 * @return int
	 */
	public function findCountDuplicateRules($wfrule_id, $ruletypeid, $asp_client_id) {
		$select = new Select();

		$select->count(true, 'rulecount')
					->from('wfrule')
				->whereEquals('wfruletype_id', '?')
				->whereNotEquals('wfrule_id', '?')
				->whereEquals('asp_client_id', '?')
				->whereNotEquals('wfrule_status', '?');

		$result = $this->adapter->query($select, [$ruletypeid, $wfrule_id, $asp_client_id, 'inactive']);

		return $result[0]['rulecount'];
	}


	/**
	 * Find conflicting rules by properties
	 *
	 * @param int $wfrule_id
	 * @param int $wfruletype_id
	 * @param int $wfrule_operand
	 * @param int $wfrule_number
	 * @param int $wfrule_number_end
	 * @return array
	 */
	public function findConflictingRulesByProperties($wfrule_id, $wfruletype_id, $wfrule_operand, $wfrule_number, $wfrule_number_end) {
		$select = new Select();
		$subselect = new Select();

		$wfrule_number = is_numeric($wfrule_number) ? $wfrule_number : 'null';
		$wfrule_number_end = is_numeric($wfrule_number_end) ? $wfrule_number_end : 'null';
		$fraction = 0.01;

		$subselect->distinct()->columns(['tablekey_id'])
				->from(['wftarget' => 'wfruletarget'])
					->whereEquals('wftarget.wfrule_id', $wfrule_id)
					->whereEquals('wftarget.table_name', "'property'");

		$select->distinct()
					->columns(['wfrule_id'])
				->from(['wfr' => 'wfrule'])
					->join(['wfrt' => 'wfruletarget'], 'wfr.wfrule_id = wfrt.wfrule_id', [])
				->whereEquals('wfrt.table_name', "'property'")
				->whereIn('wfrt.tablekey_id', $subselect)
				->whereNotEquals('wfr.wfrule_id', $wfrule_id)
				->whereNest('OR')
					->whereNest()
						->whereEquals('wfr.wfrule_operand', "'{$wfrule_operand}'")
						->whereNotEquals("'{$wfrule_operand}'", "'in range'")
					->whereUnnest()
					->whereEquals("'{$wfrule_operand}'", "'greater than equal to or less than'")
					->whereEquals('wfr.wfrule_operand', "'greater than equal to or less than'")
					->whereNest()
						->whereNest('OR')
							->whereEquals("'{$wfrule_operand}'", "'greater than or equal to'")
							->whereEquals("'{$wfrule_operand}'", "'greater than'")
						->whereUnnest()
						->whereNest('OR')
							->whereEquals('wfr.wfrule_operand', "'greater than or equal to'")
							->whereEquals('wfr.wfrule_operand', "'greater than'")
						->whereUnnest()
					->whereUnnest()
					->whereNest()
						->whereEquals('wfr.wfrule_operand', "'in range'")
						->whereEquals("'{$wfrule_operand}'", "'in range'")
						->whereNest('OR')
							->whereBetween('cast(wfr.wfrule_number as float)', $wfrule_number, $wfrule_number_end)
							->whereBetween('cast(wfr.wfrule_number_end as float)', $wfrule_number, $wfrule_number_end)
							->whereBetween($wfrule_number, 'cast(wfr.wfrule_number as float)', 'cast(wfr.wfrule_number_end as float)')
							->whereBetween($wfrule_number_end, 'cast(wfr.wfrule_number as float)', 'cast(wfr.wfrule_number_end as float)')
						->whereUnnest()
					->whereUnnest()
					->whereNest()
						->whereEquals("'{$wfrule_operand}'", "'less than'")
						->whereEquals('wfr.wfrule_operand', "'greater than'")
						->whereOp('>', $wfrule_number, "cast(wfr.wfrule_number as float) + {$fraction}")
					->whereUnnest()
					->whereNest()
						->whereEquals("'{$wfrule_operand}'", "'greater than'")
						->whereEquals('wfr.wfrule_operand', "'less than'")
						->whereOp('<', $wfrule_number, "cast(wfr.wfrule_number as float) - {$fraction}")
					->whereUnnest()
					->whereNest()
						->whereEquals("'{$wfrule_operand}'", "'less than'")
						->whereEquals('wfr.wfrule_operand', "'greater than or equal to'")
						->whereOp('>', $wfrule_number, 'wfr.wfrule_number')
					->whereUnnest()
					->whereNest()
						->whereEquals("'{$wfrule_operand}'", "'greater than or equal to'")
						->whereEquals('wfr.wfrule_operand', "'less than'")
						->whereOp('<', $wfrule_number, 'cast(wfr.wfrule_number as float)')
					->whereUnnest()
					->whereNest()
						->whereEquals("'{$wfrule_operand}'", "'in range'")
						->whereEquals('wfr.wfrule_operand', "'less than'")
						->whereOp('>', 'cast(wfr.wfrule_number as float)', $wfrule_number)
						->whereOp('<=', 'cast(wfr.wfrule_number as float)', $wfrule_number_end)
					->whereUnnest()
					->whereNest()
						->whereEquals("'{$wfrule_operand}'", "'less than'")
						->whereEquals('wfr.wfrule_operand', "'in range'")
						->whereOp('<', 'cast(wfr.wfrule_number as float)', $wfrule_number)
					->whereUnnest()
					->whereNest()
						->whereEquals("'{$wfrule_operand}'", "'in range'")
						->whereEquals('wfr.wfrule_operand', "'greater than'")
						->whereOp('>', $wfrule_number_end, 'cast(wfr.wfrule_number as float)')
					->whereUnnest()
					->whereNest()
						->whereEquals("'{$wfrule_operand}'", "'greater than'")
						->whereEquals('wfr.wfrule_operand', "'in range'")
						->whereOp('<', $wfrule_number, 'cast(wfr.wfrule_number_end as float)')
					->whereUnnest()
					->whereNest()
						->whereEquals("'{$wfrule_operand}'", "'in range'")
						->whereEquals('wfr.wfrule_operand', "'greater than or equal to'")
						->whereOp('>=', $wfrule_number_end, 'cast(wfr.wfrule_number as float)')
					->whereUnnest()
					->whereNest()
						->whereEquals("'{$wfrule_operand}'", "'greater than or equal to'")
						->whereEquals('wfr.wfrule_operand', "'in range'")
						->whereOp('<=', $wfrule_number, 'cast(wfr.wfrule_number_end as float)')
					->whereUnnest()
				->whereUnnest()
				->whereNotEquals('wfr.wfrule_status', "'inactive'")
				->whereEquals('wfr.wfruletype_id', $wfruletype_id);

		$result = $this->adapter->query($select);

		$conflictingRulesByProperties = [];
		foreach ($result as $item) {
			$conflictingRulesByProperties[] = $item['wfrule_id'];
		}

		return $conflictingRulesByProperties;
	}


	public function getConflictingRulesById($conflictingRulesIdList) {
		$rulePlaceHolders = $this->createPlaceholders($conflictingRulesIdList);

		$select = new Select();

		$select->columns(['wfrule_id', 'wfrule_name', 'wfruletype_id', 'wfrule_status',
				new Expression(
					'CASE WHEN wfa.wfaction_originator_tablename=\'role\' THEN (' .
						Select::get()->columns([])
							->from(['wfn' => 'wfaction'])
							->join(['r' => 'role'], 'wfn.wfaction_originator_tablekey_id = r.role_id', ['role_name'])
								->whereEquals('wfn.wfaction_originator_tablekey_id', 'wfa.wfaction_originator_tablekey_id')
								->whereEquals('wfn.wfaction_originator_tablename', "'role'")
							->limit(1)
							->toString() .
					') ELSE (' .
						Select::get()->columns([])
							->from(['stf' => 'staff'])
							->join(['p' => 'person'],
									'stf.person_id = p.person_id',
									['person_lastname + \' \' + person_firstname + \' \' + person_middlename']
							)
							->join(['u' => 'userprofilerole'], 'stf.staff_id = u.tablekey_id', [])
							->join(['wfact' => 'wfaction'], 'wfact.wfaction_originator_tablekey_id = u.userprofilerole_id', [])
								->whereEquals('wfact.wfaction_originator_tablekey_id', 'wfa.wfaction_originator_tablekey_id')
								->whereEquals('wfact.wfaction_originator_tablename', "'userprofilerole'")
							->limit(1)
							->toString() .
					') END AS originator'
				)
			])
			->from(['wfr' => 'wfrule'])
				->join(['ruletype' => 'wfruletype'], 'wfr.wfruletype_id = ruletype.wfruletype_id', ['wfruletype_name'])
				->join(['wfa' => 'wfaction'], 'wfr.wfrule_id = wfa.wfrule_id', ['wfaction_originator_tablename'])
//			->whereNotEquals('wfr.wfrule_status', "'inactive'")
			->whereIn('wfr.wfrule_id', $rulePlaceHolders);

		return $this->adapter->query($select, $conflictingRulesIdList);
	}


	public function findUserProfileById($id) {
		$select = new Select();

		$select->from('userprofilerole')->whereEquals('userprofilerole_id', '?');

		return $this->adapter->query($select, [$id]);
	}

	/**
	 * Retrieve Select by criteria type
	 *
	 * @param $criteriaType
	 * @param $asp_client_id
	 * @param $criteria
	 * @param $order
	 * @return sql\SearchByGLAccountSelect|sql\SearchByPropertySelect|sql\SearchByRoleSelect|sql\SearchByRuleTypeSelect|sql\SearchByUserSelect|sql\SearchByVendorSelect|sql\SearchSelect
	 */
	private function setSearchCriteriaSelect($criteriaType,$asp_client_id, $criteria, $order) {
		switch ($criteriaType ) {
			case self::NO_CRITERIA:
			default:
				return new sql\SearchSelect($asp_client_id, $order);
			case self::PROPERTY_CRITERIA:
				return new sql\SearchByPropertySelect($asp_client_id, $criteria, $order);
			case self::GLACCOUNTS_CRITERIA:
				return new sql\SearchByGLAccountSelect($asp_client_id, $criteria, $order);
			case self::USERS_CRITERIA:
				return new sql\SearchByUserSelect($asp_client_id, $criteria, $order);
			case self::ROLES_CRITERIA:
				return new sql\SearchByRoleSelect($asp_client_id, $criteria, $order);
			case self::VENDORS_CRITERIA:
				return new sql\SearchByVendorSelect($asp_client_id, $criteria, $order);
			case self::RULETYPE_CRITERIA:
				return new sql\SearchByRuleTypeSelect($asp_client_id, $criteria, $order);
		}
	}
}