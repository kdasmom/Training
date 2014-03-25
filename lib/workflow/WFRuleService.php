<?php
namespace NP\workflow;

use NP\core\AbstractService;

use NP\system\ConfigService;
use NP\security\SecurityService;

use NP\workflow\WfRuleGateway;
use NP\core\db\Where;

class WFRuleService extends AbstractService {
    protected $configService, $securityService, $wfRuleGateway, $wfActionGateway, $wfRuleHourGateway, $wfRuleRelationGateway, $wfRuleScopeGateway, $wfRuleTargetGateway, $wfRuleTypeGateway;

    public function __construct(WfRuleGateway $wfRuleGateway, WFActionGateway $wfActionGateway, WFRuleHourGateway $wfRuleHourGateway,
                WFRuleRelationGateway $wfRuleRelationGateway, WFRuleScopeGateway $wfRuleScopeGateway, WfRuleTargetGateway $wfRuleTargetGateway,
                WFRuleTypeGateway $wfRuleTypeGateway
    ) {
        $this->wfRuleGateway = $wfRuleGateway;
        $this->wfActionGateway = $wfActionGateway;
        $this->wfRuleHourGateway = $wfRuleHourGateway;
        $this->wfRuleRelationGateway = $wfRuleRelationGateway;
        $this->wfRuleScopeGateway = $wfRuleScopeGateway;
        $this->wfRuleTargetGateway = $wfRuleTargetGateway;
        $this->wfRuleTypeGateway = $wfRuleTypeGateway;
    }

    public function setConfigService(ConfigService $configService) {
        $this->configService = $configService;
    }
    public function setSecurityService(SecurityService $securityService) {
        $this->securityService = $securityService;
    }

    public function get($id) {
        $asp_client_id = $this->configService->getClientId();
        return $this->wfRuleGateway->getRule(
            $id, 
            $asp_client_id, 
            [
                'UnitAttachDisplay'=> $this->configService->findSysValueByName('PN.InvoiceOptions.UnitAttachDisplay')
            ]
        );
    }

	public function copyRules($ruleIdList) {
		if (!empty($ruleIdList)) {
			$ruleIdArray = explode(',', $ruleIdList);

			foreach ($ruleIdArray as $id) {
				$result = $this->copy($id);

				if (!$result['success']) {
					return $result;
				}
			}
		}
		return [
			'success' => true
		];
	}

    public function copy($id) {
        // Find target rule
        $rule = $this->wfRuleGateway->findById($id);

        // If rule already exists then sufix should be added to the name: copy <# of the copy>
        $copy = 2;
        $name = $rule['wfrule_name'].' (copy)';

        $found = true;
        while (!empty($found)) {
            $found = $this->wfRuleGateway->find(
                Where::get()
                    ->equals('wfrule_name', '\''.$name.'\'')
                    ->in('wfrule_status', '\'new\', \'active\', \'deactive\'')
            );

            if (!empty($found) && !empty($found[0])) {
                $name = $rule['wfrule_name'].' (copy '.$copy.')';
                $copy++;
            }
        }

        // Date will not be correctly saved if last symbols starting with '.' exist (MSSQL datetime format)
        $pos = 
            strpos($rule['wfrule_datetm'], '.')
        ;
        if (!empty($pos)) {
            $rule['wfrule_datetm'] = substr($rule['wfrule_datetm'], 0, strpos($rule['wfrule_datetm'], '.'));
        }

        // Prepare Rule entity for copy.
        $ruleEntity = new WFRuleEntity([
            'wfrule_name'    => $name,
            'wfrule_operand' => $rule['wfrule_operand'],
            'wfrule_number'  => $rule['wfrule_number'],
            'wfrule_string'  => $rule['wfrule_string'],
            'wfrule_status'  => 'deactive',
            'wfruletype_id'  => $rule['wfruletype_id'],
            'wfrule_datetm'  => $rule['wfrule_datetm'],
            'asp_client_id'  => $rule['asp_client_id'],
            'DTS'            => date('Y-m-d H:i:s'),
            'wfrule_number_end'    => $rule['wfrule_number_end'],
            'isAllPropertiesWF'    => $rule['isAllPropertiesWF'],
            'wfrule_lastupdatedby' => $rule['wfrule_lastupdatedby']
        ]);

        $this->wfRuleGateway->beginTransaction();
        $this->wfActionGateway->beginTransaction();
        $this->wfRuleHourGateway->beginTransaction();
        $this->wfRuleRelationGateway->beginTransaction();
        $this->wfRuleScopeGateway->beginTransaction();
        $this->wfRuleTargetGateway->beginTransaction();

        // Check if rule entity contains correct fields.
        $errors = $this->entityValidator->validate($ruleEntity);
		$ruleid = null;

        if (empty($errors)) {
            // Try to copy the rule.
            try {
                $ruleid = $this->wfRuleGateway->save($ruleEntity);

                $this->wfActionGateway->copy($ruleid, $rule['wfrule_id']);
                $this->wfRuleHourGateway->copy($ruleid, $rule['wfrule_id']);
                $this->wfRuleRelationGateway->copy($ruleid, $rule['wfrule_id']);
                $this->wfRuleScopeGateway->copy($ruleid, $rule['wfrule_id']);
                $this->wfRuleTargetGateway->copy($ruleid, $rule['wfrule_id']);


                $this->wfRuleGateway->commit();
                $this->wfActionGateway->commit();
                $this->wfRuleHourGateway->commit();
                $this->wfRuleRelationGateway->commit();
                $this->wfRuleScopeGateway->commit();
                $this->wfRuleTargetGateway->commit();
            } catch (Exception $e) {
                $errors = [
                    'Couldn\'t copy all necessary records'
                ];

                $this->wfRuleGateway->rollback();
                $this->wfActionGateway->rollback();
                $this->wfRuleHourGateway->rollback();
                $this->wfRuleRelationGateway->rollback();
                $this->wfRuleScopeGateway->rollback();
                $this->wfRuleTargetGateway->rollback();
            }
        }
        return [
            'success' => (empty($errors)) ? true : false,
			'ruleid'  => $ruleid,
            'errors'  => $errors
        ];
    }

    public function save($data) {
        
    }

    public function deleteRules($ruleIdList) {
		if (!empty($ruleIdList)) {
			$ruleIdArray = explode(',', $ruleIdList);

			foreach ($ruleIdArray as $id) {
				$this->wfRuleGateway->setRuleStatus($id, 3);
			}
			return [
				'success' => true
			];
		}
		return [
			'success' => false,
			'error'   => 'Incorrect identifiers list'
		];
    }


/*
	public function delete($id) {
		if (!empty($id)) {
			$this->wfRuleGateway->setRuleStatus($id, 3);
			return [
				'success' => true
			];
		}
		return [
			'success' => false,
			'error'   => 'Incorrect identifier'
		];
	}
*/
    public function changeStatus($id, $status) {
        if (!empty($id) && in_array($status, [1, 2])) {
            foreach ($id as $item) {
                $this->wfRuleGateway->setRuleStatus($item, $status);
            }
            return [
                'success' => true
            ];
        }
        return [
            'success' => false,
            'error'   => 'Incorrect identifiers list or status'
        ];
    }

    public function search($type = 0, $criteria = null, $page = null, $pageSize = null, $sort = "wfrule_name") {
        $asp_client_id = $this->configService->getClientId();
        return $this->wfRuleGateway->findRule($asp_client_id, $type, $criteria, $page, $pageSize, $sort);
    }

    public function listRulesType() {
        return $this->wfRuleTypeGateway->find(null, [], 'ordinal', ['wfruletype_id', 'wfruletype_name', 'type_id_alt', 'ordinal']);
    }

	public function saveRule($userprofile_id, $wfrule_id, $rulename, $ruletypeid, $property_keys=null, $all_properties, $wfrule_operand=null, $wfrule_number=null, $tablekeys = null, $wfrule_number_end = null) {
		$now = \NP\util\Util::formatDateForDB();
		$asp_client_id = $this->configService->getClientId();
		$property_keys = explode(',', $property_keys);
		$tablekeys = explode(',', $tablekeys);
		$status = 'deactive';

		$ruleid = ($wfrule_id != '') ? $wfrule_id : null;

		switch ($ruletypeid) {
			case WFRuleTypeGateway::VENDOR_ESTIMATE_TOTAL_DOLLAR_AMOUNT:
			case WFRuleTypeGateway::YTD_BUDGET_PERCENT_OVERAGE_BY_GL_CODE:
			case WFRuleTypeGateway::YTD_BUDGET_PERCENT_OVERAGE_BY_GL_CATEGORY:
			case WFRuleTypeGateway::MTD_BUDGET_PERCENT_OVERAGE_BY_GL_CODE:
			case WFRuleTypeGateway::MTD_BUDGET_PERCENT_OVERAGE_BY_GL_CATEGORY:
				$numberType = wfRuleGateway::NUMBER_TYPE_PERCENTAGE;
				break;
			case WFRuleTypeGateway::DELEGATION:
				$numberType = wfRuleGateway::NUMBER_TYPE_USER_PRIVILEGES;
				break;
			default:
				$numberType = wfRuleGateway::NUMBER_TYPE_ACTUAL;
		}

		$dataSet = [
			'wfrule_id' => $ruleid,
			'wfrule_name' => $rulename,
			'wfrule_status' => $status,
			'wfruletype_id' => $ruletypeid,
			'wfrule_datetm' => $now,
			'asp_client_id' => $asp_client_id,
			'wfrule_lastupdatedby' => $userprofile_id,
			'wfrule_operand' => $wfrule_operand,
			'wfrule_number' => $wfrule_number,
			'wfrule_number_end' => $wfrule_number_end,
			'wfrule_string' => $numberType,
			'isAllPropertiesWF' => $all_properties
		];

		// save wf rule
		if (is_null($ruleid)) {
			$ruleid = $this->wfRuleGateway->save($dataSet);
		}
		else {
			$this->wfRuleGateway->update($dataSet, ['wfrule_id' => '?', 'asp_client_id' => '?'], [$ruleid, $asp_client_id]);
		}

		// save wf rule properties
		if ($all_properties) {
			$this->wfRuleTargetGateway->addAllPropertiesToRules($ruleid, 'property', $asp_client_id, [1, -1]);
		}
		else {
			if (!is_null($property_keys)) {
				$this->wfRuleTargetGateway->delete(['wfrule_id' => '?'], [$ruleid]);

				foreach ($property_keys as $property_key) {
					$this->SaveWFRuleTarget($ruleid, 'property', $property_key);
				}
			}
		}

		// save wf rule type options
//		$this->wfRuleScopeGateway->delete(['wfrule_id' => '?'], [$ruleid]);

		switch ($ruletypeid) {
			case WFRuleTypeGateway::BUDGET_AMOUNT_BY_GL_CODE:
			case WFRuleTypeGateway::INVOICE_BY_GL_CODE:
			case WFRuleTypeGateway::PURCHASE_ORDER_BY_GL_CODE:
			case WFRuleTypeGateway::YEARLY_BUDGET_BY_GL_CODE:
			case WFRuleTypeGateway::YTD_BUDGET_PERCENT_OVERAGE_BY_GL_CODE:
			case WFRuleTypeGateway::MTD_BUDGET_PERCENT_OVERAGE_BY_GL_CODE:
			case WFRuleTypeGateway::YTD_BUDGET_OVERAGE_BY_GL_CODE:
			case WFRuleTypeGateway::RECEIPT_ITEM_TOTAL_BY_GL_CODE:
			case WFRuleTypeGateway::BUDGET_AMOUNT_BY_GL_CATEGORY:
			case WFRuleTypeGateway::INVOICE_BY_GL_CATEGORY:
			case WFRuleTypeGateway::PURCHASE_ORDER_BY_GL_CATEGORY:
			case WFRuleTypeGateway::BUDGET_OVERAGE_NOTIFICATION_EMAIL:
			case WFRuleTypeGateway::YEARLY_BUDGET_BY_GL_CATEGORY:
			case WFRuleTypeGateway::YTD_BUDGET_PERCENT_OVERAGE_BY_GL_CATEGORY:
			case WFRuleTypeGateway::MTD_BUDGET_PERCENT_OVERAGE_BY_GL_CATEGORY:
			case WFRuleTypeGateway::YTD_BUDGET_OVERAGE_BY_GL_CATEGORY:
			case WFRuleTypeGateway::RECEIPT_ITEM_TOTAL_BY_GL_CATEGORY:
				foreach ($tablekeys as $tablekeyid) {
					$this->wfRuleScopeGateway->insert([
						'wfrule_id'   => $ruleid,
						'table_name'  => 'glaccount',
						'tablekey_id' => $tablekeyid
					]);
				}
				break;
			case WFRuleTypeGateway::SPECIFIC_VENDOR:
			case WFRuleTypeGateway::SPECIFIC_VENDOR_MASTER_RULE:
				$this->wfRuleScopeGateway->saveScopeList($ruleid, 'vendor', 'vendor_id', $tablekeys);
				break;
			case WFRuleTypeGateway::INVOICE_BY_GL_JOB_CODE:
			case WFRuleTypeGateway::PURCHASE_ORDER_BY_GL_JOB_CODE:
				$this->wfRuleScopeGateway->saveScopeList($ruleid, 'jbjobcode', 'jbjobcode_id', $tablekeys);
				break;
			case WFRuleTypeGateway::INVOICE_BY_CONTRACT_CODE:
			case WFRuleTypeGateway::PURCHASE_ORDER_BY_CONTRACT_CODE:
			case WFRuleTypeGateway::INVOICE_BY_CONTRACT_CODE_MASTER:
			case WFRuleTypeGateway::PURCHASE_ORDER_BY_CONTRACT_CODE_MASTER:
				//todo
				foreach ($tablekeys as $tablekeyid) {
					$this->wfRuleScopeGateway->insert([
						'wfrule_id'   => $ruleid,
						'table_name'  => 'jbcontract',
						'tablekey_id' => $tablekeyid
					]);
				}
				break;
			case WFRuleTypeGateway::INVOICE_TOTAL_BY_PAY_BY:
				$this->wfRuleScopeGateway->saveScopeList($ruleid, 'invoicepaymenttype', 'invoicepayment_type_id', $tablekeys);
				break;
			case WFRuleTypeGateway::PO_ITEM_AMOUNT_BY_DEPARTMENT:
			case WFRuleTypeGateway::INVOICE_ITEM_AMOUNT_BY_DEPARTMENT:
				foreach ($tablekeys as $tablekeyid) {
					$this->wfRuleScopeGateway->insert([
						'wfrule_id'   => $ruleid,
						'table_name'  => 'unit',
						'tablekey_id' => $tablekeyid
					]);
				}
				break;
		}

		if ($wfrule_id != '') {
			$ruledata = $this->wfRuleGateway->getRuleData($ruleid, $asp_client_id);
		}
		else {
			$ruledata = $this->get($ruleid);
		}

		return [
			'success' => true,
			'ruledata' => $ruledata
		];
	}

	public function SaveWFRuleTarget($wfrule_id, $tablename, $tablekey_id) {
		$this->wfRuleTargetGateway->insert([
			'wfrule_id'   => $wfrule_id,
			'table_name'  => $tablename,
			'tablekey_id' => $tablekey_id
		]);
	}

	public function GetRuleOriginators($wfruleid) {
		$asp_client_id = $this->configService->getClientId();
		return $this->wfActionGateway->GetRuleOriginators($wfruleid, $asp_client_id);
	}

	public function DeleteRuleOriginator($wfactionid) {
		return $this->wfActionGateway->DeleteRuleOriginator($wfactionid);
	}


	public function saveRoute($data) {
		switch ($data['originatesfrom']) {
			case 'groups':
				$originator_tablename = 'role';
				$originator_tablekeys_list = $data['groupsfrom'];
				break;
			case 'users':
				$originator_tablename = 'userprofilerole';
				$originator_tablekeys_list = $data['usersfrom'];
				break;
			default:
				$originator_tablename = '';
				$originator_tablekeys_list = '';
		}

		switch ($data['forwardto']) {
			case 'groups':
				$receipient_tablename = 'role';
				$receipient_tablekeys_list = $data['groupsto'];
				break;
			case 'users':
				$receipient_tablename = 'userprofilerole';
				$receipient_tablekeys_list = $data['usersto'];
				break;
			default:
				$receipient_tablename = '';
				$receipient_tablekeys_list = '';
		}

		$originator_tablekeys = explode(',', $originator_tablekeys_list);
		$receipient_tablekeys = explode(',', $receipient_tablekeys_list);

		if ($data['forwardto'] == 'next') {
			if (count($originator_tablekeys) > 0) {
				$this->wfActionGateway->delete(
					Where::get()->in('wfaction_originator_tablekey_id', $originator_tablekeys_list)
						->equals('wfaction_originator_tablename', '?')
						->equals('wfrule_id', '?'),
					[$originator_tablename, $data['wfrule_id']]
				);

				foreach ($originator_tablekeys as $originator_tablekey) {
					$this->wfActionGateway->insert([
						'wfrule_id'   => $data['wfrule_id'],
						'wfactiontype_id'  => '',
						'wfaction_originator_tablename' => $originator_tablename,
						'wfaction_originator_tablekey_id' => $originator_tablekey,
						'wfaction_nextlevel' => 'Y'
					]);
				}
			}
			else {
				// error
			}
		}
		else if (count($originator_tablekeys) > 0 && count($receipient_tablekeys) > 0) {
			$this->wfActionGateway->delete(
				Where::get()->in('wfaction_originator_tablekey_id', $originator_tablekeys_list)
					->equals('wfaction_originator_tablename', '?')
					->in('wfaction_receipient_tablekey_id', $receipient_tablekeys_list)
					->equals('wfaction_receipient_tablename', '?')
					->equals('wfrule_id', '?'),
				[$originator_tablename, $receipient_tablename, $data['wfrule_id']]
			);

			foreach ($originator_tablekeys as $originator_tablekey) {
				foreach ($receipient_tablekeys as $receipient_tablekey) {
					$this->wfActionGateway->insert([
						'wfrule_id'   => $data['wfrule_id'],
						'wfactiontype_id'  => '',
						'wfaction_receipient_tablename' => $originator_tablename,
						'wfaction_receipient_tablekey_id' => $originator_tablekey,
						'wfaction_originator_tablename' => $receipient_tablename,
						'wfaction_originator_tablekey_id' => $receipient_tablekey
					]);
				}
			}
		}
		else {
			// error
		}
		$oktoactivate = true;
	}

	public function getConflictingRules($wfrule_id) {
		$asp_client_id = $this->configService->getClientId();

		$rule = $this->findById($wfrule_id);

		$select = new Select();
		$subselect = new Select();

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
				->whereUnnest();

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
				$routes = $this->wfActionGateway->find('wfrule_id = ?', [$wfrule_id]);

				foreach ($routes as $route) {
					if ($route['wfaction_originator_tablename'] == 'role') {

//						SELECT userprofilerole_id FROM USERPROFILEROLE WHERE role_id = @originator_tablekey_id
						$select->columns(['wfrule_id'])
							->from('wfaction')
							->whereIn(
								'wfaction_originator_tablekey_id',
								$subselect->columns(['userprofilerole_id'])
									->from('userprofilerole')
									->whereEquals('role_id', '?') // $data['wfaction_originator_tablekey_id'];
							)
							->whereNotEquals('wfrule_id', '?')
							->whereEquals('wfaction_originator_tablename', '?'); // 'userprofilerole'
						$result = $this->adapter->query($select, [$route['wfaction_originator_tablekey_id'], $wfrule_id, 'userprofilerole']);

						if (count($result) == 0) {
//							SELECT @originator_tablekey_id = role_id, @originator_tablename = 'role'
//								FROM USERPROFILEROLE
//							WHERE userprofilerole_id = @originator_tablekey_id
						}
//							IF (@originator_exists = 0)
//							BEGIN
//								SELECT @originator_tablekey_id = role_id, @originator_tablename = 'role'
//								FROM USERPROFILEROLE
//								WHERE userprofilerole_id = @originator_tablekey_id
//							END
					}

//					wfaction_originator_tablename,
//					wfaction_originator_tablekey_id,
//					wfaction_receipient_tablename,
//					wfaction_receipient_tablekey_id,
//					wfaction_nextlevel
				}
			}
		}
//		return $this->wfRuleGateway->getConflictingRules($wfrule_id, $asp_client_id);
	}

	//TODO delete this
	public function getUnits() {
		$items = $this->wfRuleGateway->getUnits();

		$unitTerm = $this->configService->get('PN.InvoiceOptions.UnitAttachDisplay', 'Unit');
		$units = [];

		foreach ($items as $item) {
			if ($unitTerm == 'unitcode') {
				$item['unit_display'] = strtoupper($item['unit_id_alt'] . ' - ' . $item['unit_number']);
			}
			else if ($item['building_id_alt'] != '') {
				$item['unit_display'] = strtoupper($item['building_id_alt'] . ' - ' . $item['unit_number']);
			}
			else {
				$item['unit_display'] = strtoupper( $item['unit_number']);
			}

			$units[] = $item;
		}

		return $units;
	}
}