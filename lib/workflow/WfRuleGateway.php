<?php

namespace NP\workflow;

use NP\core\AbstractGateway;
use NP\core\db\Adapter;
use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Update;
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

		$selectors = [];
		switch ($type) {
			case 0: 
				$selectors[] = new sql\SearchSelect($asp_client_id, $order);
				break;
			case 1:
				$selectors[] = new sql\SearchByPropertySelect($asp_client_id, $criteria, $order);
				break;
			case 2:
				$selectors[] = new sql\SearchByGLAccountSelect01($asp_client_id, $criteria, $order);
				$selectors[] = new sql\SearchByGLAccountSelect02($asp_client_id, $criteria, $order);
				break;
			case 3:
				$selectors[] = new sql\SearchByUserSelect01($asp_client_id, $criteria, $order);
				$selectors[] = new sql\SearchByUserSelect02($asp_client_id, $criteria, $order);
				break;
			case 4:
				$selectors[] = new sql\SearchByRoleSelect01($asp_client_id, $criteria, $order);
				break;
			case 5:
				$selectors[] = new sql\SearchByVendorSelect($asp_client_id, $criteria, $order);
				break;
			case 6:
				$selectors[] = new sql\SearchByRuleTypeSelect($asp_client_id, $criteria, $order);
				break;
		}

		$countPropertiesResult = $this->adapter->query(
			new \NP\property\sql\GetPropertiesCountSelect($asp_client_id)
		);
		$countProperties = $countPropertiesResult[0]['count'];

		$result = [];
//		if ($type != 0) {
//			if (!empty($selectors)) {
//				foreach($selectors as $select) {
//					$result[] = $this->adapter->query($select);
//				}
//			}
//		} else {
			if (!empty($size)) {
//				if ($selectors > 1) {
//					$selectors[0]->union($selectors[1], false);
//					$result = $this->getPagingArray($selectors[0], [], $size, $page, 'wfrule_id');
//				}
//				else {
					$result = $this->getPagingArray($selectors[0], [], $size, $page, 'wfrule_id');
//				}

			} else {
				$result = $this->adapter->query($selectors[0]);
			}
//		}

		foreach ($result['data'] as &$item) {
			$item['all_properties_selected'] = ($item['count_properties'] == $countProperties) ? true : false;
		}

		return $result;
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
			'properties' => $this->adapter->query(
				new sql\GetRulePropertiesSelect($ruleid)
			),

			'contract_list_id' => [],
			'units' => [],
			'vendor_list_id' => [],
			'glaccount_list_id' => []
		];

		if (!empty($result['rule']) && !empty($result['rule'][0])) {
			$result['rule'] = $result['rule'][0];

			$countPropertiesResult = $this->adapter->query(
				new \NP\property\sql\GetPropertiesCountSelect($asp_client_id)
			);
			$countProperties = $countPropertiesResult[0]['count'];

			$selected = 0;
			$properties = [];
			foreach ($result['properties'] as $property) {
				$selected++;
				$properties[] = $property['property_id'];
			}

			$result['properties'] = [
				'all' => $countProperties == $selected,
				'property_list_id' => $properties
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
//			if (in_array($type, [9, 10, 11, 12, 14, 30, 32, 34, 38])) {
				$glaccounts = $this->adapter->query(
					new sql\GLAccountByWFRuleSelect($ruleid, $asp_client_id)
				);
				$glaccount_list_id = [];
				foreach ($glaccounts as $glaccount) {
					$glaccount_list_id[] = $glaccount['glaccount_id'];
				}

				$result['glaccount_list_id'] = $glaccount_list_id;
//			}
			if (in_array($type, [24, 25, 26, 27])) {
				$contracts = $this->adapter->query(
					new sql\JobContractByWFRuleScope($ruleid)
				);

				$contract_list_id = [];
				foreach ($contracts as $contract) {
					$contract_list_id[] = $contract['contract_list_id'];
				}

				$result['contract_list_id'] = $contract_list_id;
			}
			if (in_array($type, [6, 16])) {
				$where = Where::get()->in('v.vendor_id', implode(',', $keys));
				$vendors = $this->vendorGateway->find($where, [], null, ['vendor_id']);

				$vendor_list_id = [];
				foreach ($vendors as $vendor) {
					$vendor_list_id[] = $vendor['vendor_id'];
				}

				$result['vendor_list_id'] = $vendor_list_id;

//				foreach ($vendors as $vendor) {
//					$result['vendors'][$vendor['vendor_id']] = $vendor['vendor_name'];
//				}
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


	public function getConflictingRules($wfrule_id, $asp_client_id) {
		$rule = $this->findById($wfrule_id);

		$select = new Select();
		$select->count(true, 'rulecount')
				->from('wfrule')
					->whereEquals('wfruletype_id', '?')
					->whereNotEquals('wfrule_id', '?')
					->whereEquals('asp_client_id', '?')
					->whereNotEquals('wfrule_status', '?');
		$result = $this->adapter->query($select, [$rule['wfruletype_id'], $wfrule_id, $asp_client_id, $rule['wfrule_status']]);
		print_r($result);

		if ($result[0]['rulecount'] > 0) {
			$select->distinct()
					->columns(['wfrule_id'])
					->from(['wfr'  => 'wfrule'])
						->join(['wfrt' => 'wfruletarget'], 'wfr.wfrule_id = wfrt.wfrule_id')
						->join(['wfp'  => 'wfruletarget'], 'wfrt.tablekey_id = wfp.tablekey_id')
					->whereEquals('wfrt.table_name', '?')
					->whereNotEquals('wfr.wfrule_id', '?')
					->whereNest('OR')
						->whereNest()
							->whereEquals('wfrt.table_name', '?')
						->whereUnnest()

//				->whereNest('OR')
//					->whereNest()
//						->whereEquals('wa.wfaction_originator_tablename', "'userprofilerole'")
//						->whereEquals('wa.wfaction_originator_tablekey_id', '?')
//					->whereUnnest()
//					->whereNest()
//						->whereEquals('wa.wfaction_originator_tablename', "'role'")
//						->whereEquals('wa.wfaction_originator_tablekey_id', '?')
//					->whereUnnest()
//				->whereUnnest(),
			;
			$result = $this->adapter->query($select, ["'property'", $wfrule_id]);

			$propertyConflictWFRules = $result;

			if (count($propertyConflictWFRules) > 0) {


//				SELECT  wfaction_originator_tablename,
//					wfaction_originator_tablekey_id,
//					wfaction_receipient_tablename,
//
//					wfaction_receipient_tablekey_id,
//					wfaction_nextlevel
//				FROM WFACTION
//				WHERE wfrule_id = @in_wfrule_id
			}
		}

		/*
			SELECT DISTINCT wfr.wfrule_id FROM WFRULE wfr
			INNER JOIN WFRULETARGET wfrt ON wfr.wfrule_id = wfrt.wfrule_id AND wfrt.table_name = 'property'
			INNER JOIN @WFPROPERTY wfp ON wfrt.tablekey_id = wfp.property_id AND wfrt.table_name = 'property'
			WHERE wfrt.table_name = 'property' AND
				wfr.wfrule_id <> @in_wfrule_id AND (
					(wfr.wfrule_operand = @wfrule_operand AND @wfrule_operand <> 'in range')
				OR (@wfrule_operand = 'greater than equal to or less than')
				OR (wfr.wfrule_operand = 'greater than equal to or less than')

				-- GTE always conflicts with GT
				OR ((@wfrule_operand = 'greater than or equal to' OR @wfrule_operand='greater than') AND (wfr.wfrule_operand='greater than or equal to' OR wfr.wfrule_operand='greater than'))

				-- range conflicts with intersecting ranges
				OR (@wfrule_operand='in range' AND wfr.wfrule_operand='in range'
					AND (	(cast(wfr.wfrule_number as float) BETWEEN @wfrule_number AND @wfrule_number_end)
						OR (cast(wfr.wfrule_number_end as float) BETWEEN @wfrule_number AND @wfrule_number_end)
						OR (@wfrule_number BETWEEN cast(wfr.wfrule_number as float) AND cast(wfr.wfrule_number_end as float))
						OR (@wfrule_number_end BETWEEN cast(wfr.wfrule_number as float) AND cast(wfr.wfrule_number_end as float))
					)
				)

				-- LT conflicts with GT when greater than GT number + 1 fraction
				OR (@wfrule_operand='less than' AND (wfr.wfrule_operand='greater than')
					AND (@wfrule_number > cast(wfr.wfrule_number as float) + @fraction)
				)
				-- GT conflicts with LT when less than LT number - 1 fraction
				OR ((@wfrule_operand='greater than') AND wfr.wfrule_operand='less than'
					AND (@wfrule_number < cast(wfr.wfrule_number as float) - @fraction)
				)

				-- LT conflicts with GTE when not less than GTE number
				OR (@wfrule_operand='less than' AND (wfr.wfrule_operand='greater than or equal to')
					AND @wfrule_number > wfr.wfrule_number
				)
				-- GTE conflicts with LT when less than LT number
				OR ((@wfrule_operand='greater than or equal to') AND wfr.wfrule_operand='less than'
					AND (@wfrule_number < cast(wfr.wfrule_number as float))
				)

				-- range conflicts with LT when LT number between range (not including bottom end of range)
				-- LT conflicts with range when range number less than to LT number
				OR (@wfrule_operand='in range' AND wfr.wfrule_operand='less than' AND cast(wfr.wfrule_number as float) > @wfrule_number AND cast(wfr.wfrule_number as float) <= @wfrule_number_end) --BETWEEN @wfrule_number AND @wfrule_number_end)
				OR (@wfrule_operand='less than' AND wfr.wfrule_operand='in range' AND cast(wfr.wfrule_number as float) < @wfrule_number)

				-- range conflicts with GT when range end-number is greater than GT number
				-- GT conflicts with range when GT number is less than range end-number
				OR (@wfrule_operand='in range' AND wfr.wfrule_operand='greater than' AND @wfrule_number_end > cast(wfr.wfrule_number as float))
				OR (@wfrule_operand='greater than' AND wfr.wfrule_operand='in range' AND @wfrule_number < cast(wfr.wfrule_number_end as float))

				-- range conflicts with GTE when range end-number is greater than equal to GTE number
				-- GTE conflicts with range when GTE number is less than equal to range end-number
				OR (@wfrule_operand='in range' AND wfr.wfrule_operand='greater than or equal to' AND @wfrule_number_end >= cast(wfr.wfrule_number as float))
				OR (@wfrule_operand='greater than or equal to' AND wfr.wfrule_operand='in range' AND @wfrule_number <= cast(wfr.wfrule_number_end as float))

				) AND

				wfr.wfrule_status <> 'inactive' AND
				((wfruletype_id = @wfruletype_id)
				-- These are for rules that have gl codes and gl categories...b/c the different types can conflict
				--invoicetotal
				--OR (@wfruletype_id = 2 and wfruletype_id = 2)
				--pototal
				--OR (@wfruletype_id = 1 and wfruletype_id = 1)
				--po item
				--OR (@wfruletype_id = 11 and wfruletype_id = 8) OR (@wfruletype_id = 8 and wfruletype_id = 11)
				--invoiceitem
				--OR (@wfruletype_id = 7 and wfruletype_id = 10) OR (@wfruletype_id = 10 and wfruletype_id = 7)
				--budget
				--OR (@wfruletype_id = 9 and wfruletype_id = 3) OR (@wfruletype_id = 3 and wfruletype_id = 9)
				--yearly
				--OR (@wfruletype_id = 13 and wfruletype_id = 14) OR (@wfruletype_id = 14 and wfruletype_id = 13)
				)
		*/
	}
}