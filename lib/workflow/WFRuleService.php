<?php
namespace NP\workflow;

use NP\core\AbstractService;

use NP\system\ConfigService;
use NP\security\SecurityService;

use NP\workflow\WfRuleGateway;
use NP\user\UserprofileGateway;
use NP\core\db\Where;

class WFRuleService extends AbstractService {
    protected $configService, $securityService;

    public function setConfigService(ConfigService $configService) {
        $this->configService = $configService;
    }

    public function setSecurityService(SecurityService $securityService) {
        $this->securityService = $securityService;
    }

	/**
	 * Get workflow rule
	 *
	 * @param int $id - workflow rule id
	 * @return array
	 */
	public function get($id, $mode) {
        $asp_client_id = $this->configService->getClientId();
		$unitAttachDisplay = $this->configService->findSysValueByName('PN.InvoiceOptions.UnitAttachDisplay');

        return $this->wfRuleGateway->getRule($id, $asp_client_id, $mode, ['UnitAttachDisplay' => $unitAttachDisplay]);
    }

	/**
	 * Copy rules
	 *
	 * @param array $ruleIdList
	 * @return array
	 */
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

	/**
	 * Copy rule
	 *
	 * @param int $id
	 * @return array
	 */
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
            'wfrule_lastupdatedby' => $rule['wfrule_lastupdatedby'],
            'region_id'            => $rule['region_id']
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

	/**
	 * Delete Rules
	 * @param $ruleIdList - array of rule id
	 * @return array
	 */
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

	/**
	 * Change rule status
	 *
	 * @param int $id
	 * @param int $status
	 * @return array
	 */
	public function changeStatus($id, $status) {
		if (!empty($id) && in_array($status, [1, 2])) {
			$rulesWithConflicts = [];

			if ($status == 1) {
				$rulesWithConflictsIdList = [];

				foreach ($id as $ruleid) {
					$activateResult = $this->activateRule($ruleid);

					if (!$activateResult['activateStatus']) {
						$rulesWithConflictsIdList[] = $ruleid;
					}
				}
				if (count($rulesWithConflictsIdList) > 0) {
					$rulesWithConflicts = $this->wfRuleGateway->find(
						Where::get()->in('wfrule_id', implode(',', $rulesWithConflictsIdList))
					);
				}
			}
			else {
				foreach ($id as $ruleid) {
					$this->wfRuleGateway->setRuleStatus($ruleid, $status);
				}
			}
			return [
				'success' => true,
				'rulesWithConflicts' => $rulesWithConflicts
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

    public function listRulesType($keyword = null) {
	    $where = [];
	    $params = [];
	    if ($keyword) {
		    $where = Where::get()->like('wfruletype_name', '?');
		    $params[] = '%' . $keyword . '%';
	    }

        return $this->wfRuleTypeGateway->find($where, $params, 'ordinal', ['wfruletype_id', 'wfruletype_name', 'type_id_alt', 'ordinal']);
    }

	public function saveRule($userprofile_id, $data) {
		$ruleid = $this->saveWFRule($userprofile_id, $data);

		return [
			'success' => true,
			'ruledata' => $this->get($ruleid, 'edit')
		];
	}


	public function saveAndActivateRule($userprofile_id, $data) {
		$ruleid = $this->saveWFRule($userprofile_id, $data);

		return $this->activateRule($ruleid);
	}


	public function activateRule($ruleid) {
		$activateStatus = false;

		$routes = $this->GetRuleRoutes($ruleid);
		$conflictingRules = $this->findConflictingRules($ruleid);

		if (!count($conflictingRules) && count($routes)) {
			$activateStatus = true;
			$dataSet = [
				'wfrule_id' => $ruleid,
				'wfrule_status' => 'active'
			];
			$this->wfRuleGateway->save($dataSet);
		}

		return [
			'activateStatus'   => $activateStatus,
			'conflictingRules' => $conflictingRules
		];
	}

	private function saveWFRule($userprofile_id, $data) {
		$now = \NP\util\Util::formatDateForDB();
		$asp_client_id = $this->configService->getClientId();
		$property_keys = isset($data['properties']) ? $data['properties'] : [];
		$tablekeys = isset($data['tablekeys']) ? $data['tablekeys'] : [];
		$status = 'deactive';

		$ruleid = ($data['wfrule_id'] != '') ? $data['wfrule_id'] : null;

		// get number type
		switch ($data['ruletypeid']) {
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
			'wfrule_id'            => $ruleid,
			'wfrule_name'          => $data['name'],
			'wfrule_status'        => $status,
			'wfruletype_id'        => $data['ruletypeid'],
			'wfrule_datetm'        => $now,
			'asp_client_id'        => $asp_client_id,
			'wfrule_lastupdatedby' => $userprofile_id,
			'wfrule_operand'       => isset($data['comparison']) ? $data['comparison'] : null,
			'wfrule_number'        => (isset($data['comparisonValue']) && is_numeric($data['comparisonValue'])) ? $data['comparisonValue'] : null,
			'wfrule_number_end'    => isset($data['comparisonValueTo']) ? $data['comparisonValueTo'] : null,
			'wfrule_string'        => $numberType,
			'isAllPropertiesWF'    => ($data['all_properties'] == wfRuleGateway::PROPERTY_TYPE_ALL) ? wfRuleGateway::PROPERTY_TYPE_ALL : 0,
			'region_id'            => isset($data['region_id']) ? $data['region_id'] : null
		];

		$this->wfRuleGateway->beginTransaction();
		$this->wfRuleTargetGateway->beginTransaction();
		$this->wfRuleScopeGateway->beginTransaction();
		$this->wfRuleHourGateway->beginTransaction();

		try {
			// save wf rule
			if (is_null($ruleid)) {
				$ruleid = $this->wfRuleGateway->save($dataSet);
			}
			else {
				$this->wfRuleGateway->update($dataSet, ['wfrule_id' => '?', 'asp_client_id' => '?'], [$ruleid, $asp_client_id]);
			}

			// save wf rule properties
			if ($data['all_properties'] != wfRuleGateway::PROPERTY_TYPE_REGION) {
				if ($data['all_properties']) {
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
			}
			else {
				$this->wfRuleTargetGateway->delete(['wfrule_id' => '?'], [$ruleid]);
				$this->wfRuleTargetGateway->addPropertiesByRegion($ruleid, $dataSet['region_id']);
			}

			// save wf rule type options
			$this->wfRuleScopeGateway->delete(['wfrule_id' => '?'], [$ruleid]);

			switch ($data['ruletypeid']) {
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
					$this->wfRuleScopeGateway->saveScopeList($ruleid, 'glaccount', 'glaccount_id', $tablekeys);
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
					if ($data['AllContracts']) {
						$this->wfRuleScopeGateway->insert([
							'wfrule_id'   => $ruleid,
							'table_name'  => 'jbcontract',
							'tablekey_id' => 0
						]);
					}
					else {
						$this->wfRuleScopeGateway->saveScopeList($ruleid, 'jbcontract', 'jbcontract_id', $tablekeys);
					}
					break;
				case WFRuleTypeGateway::INVOICE_TOTAL_BY_PAY_BY:
					$this->wfRuleScopeGateway->saveScopeList($ruleid, 'invoicepaymenttype', 'invoicepayment_type_id', $tablekeys);
					break;
				case WFRuleTypeGateway::PO_ITEM_AMOUNT_BY_DEPARTMENT:
				case WFRuleTypeGateway::INVOICE_ITEM_AMOUNT_BY_DEPARTMENT:
					$this->wfRuleScopeGateway->saveScopeList($ruleid, 'unit', 'unit_id', $tablekeys);
					break;
			}

			// save email suppression hour
			$this->wfRuleHourGateway->delete(['wfrule_id' => '?'], [$ruleid]);

			if ($data['ruletypeid'] == WFRuleTypeGateway::APPROVAL_NOTIFICATION_EMAIL ||
				$data['ruletypeid'] == WFRuleTypeGateway::BUDGET_OVERAGE_NOTIFICATION_EMAIL)
			{
				if ($data['comparisonValue'] === 'suppression_hours') {
					$this->wfRuleHourGateway->insert([
						'wfrule_id' => $ruleid,
						'runhour'   => $data['email_suppression_hours']
					]);
				}
			}

			$this->wfRuleGateway->commit();
			$this->wfRuleTargetGateway->commit();
			$this->wfRuleScopeGateway->commit();
			$this->wfRuleHourGateway->commit();
		} catch(\Exception $e) {
			$this->wfRuleGateway->rollback();
			$this->wfRuleTargetGateway->rollback();
			$this->wfRuleScopeGateway->rollback();
			$this->wfRuleHourGateway->rollback();
		}

		return $ruleid;
	}


	public function SaveWFRuleTarget($wfrule_id, $tablename, $tablekey_id) {
		$this->wfRuleTargetGateway->insert([
			'wfrule_id'   => $wfrule_id,
			'table_name'  => $tablename,
			'tablekey_id' => $tablekey_id
		]);
	}

	public function GetRuleRoutes($wfruleid) {
		$asp_client_id = $this->configService->getClientId();
		return $this->wfActionGateway->findRuleRoutes($wfruleid, $asp_client_id);
	}

	public function DeleteRuleRoute($wfactionid) {
		return $this->wfActionGateway->deleteRuleRoute($wfactionid);
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

		$originator_tablekeys = $originator_tablekeys_list;
		$receipient_tablekeys = $receipient_tablekeys_list;

		if ($data['forwardto'] == 'next') {
			if (count($originator_tablekeys)) {
				$tablekey_params = array_fill(0, count($originator_tablekeys_list), '?');
				$tablekey_params = implode(',', $tablekey_params);

				$this->wfActionGateway->delete(
					Where::get()->in('wfaction_originator_tablekey_id', $tablekey_params)
						->equals('wfaction_originator_tablename', '?')
						->equals('wfrule_id', '?'),
					array_merge($originator_tablekeys, [$originator_tablename, $data['wfrule_id']])
				);

				foreach ($originator_tablekeys as $originator_tablekey) {
					$this->wfActionGateway->insert([
						'wfrule_id'   => $data['wfrule_id'],
						'wfactiontype_id'  => null,
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
			$originator_params = array_fill(0, count($originator_tablekeys_list), '?');
			$originator_params = implode(',', $originator_params);
			$receipient_params = array_fill(0, count($receipient_tablekeys_list), '?');
			$receipient_params = implode(',', $receipient_params);

			$this->wfActionGateway->delete(
				Where::get()->in('wfaction_originator_tablekey_id', $originator_params)
					->in('wfaction_receipient_tablekey_id', $receipient_params)
					->equals('wfaction_originator_tablename', '?')
					->equals('wfaction_receipient_tablename', '?')
					->equals('wfrule_id', '?'),
				array_merge($originator_tablekeys, $receipient_tablekeys, [$originator_tablename, $receipient_tablename, $data['wfrule_id']])
			);

			foreach ($originator_tablekeys as $originator_tablekey) {
				foreach ($receipient_tablekeys as $receipient_tablekey) {
					$this->wfActionGateway->insert([
						'wfrule_id'                       => $data['wfrule_id'],
						'wfactiontype_id'                 => null,
						'wfaction_receipient_tablename'   => $receipient_tablename,
						'wfaction_receipient_tablekey_id' => $receipient_tablekey,
						'wfaction_originator_tablename'   => $originator_tablename,
						'wfaction_originator_tablekey_id' => $originator_tablekey
					]);
				}
			}
		}
		else {
			// error
		}
	}

	public function findConflictingRules($wfrule_id) {
		$asp_client_id = $this->configService->getClientId();

		$rule = $this->WfRuleGateway->findById($wfrule_id);

		$countDuplicateRules = $this->WfRuleGateway->findCountDuplicateRules($wfrule_id, $rule['wfruletype_id'], $asp_client_id);

		$conflictsRules = [];

		if ($countDuplicateRules > 0) {
			$conflictingRulesByProperties = $this->wfRuleGateway->findConflictingRulesByProperties($rule['wfrule_id'], $rule['wfruletype_id'], $rule['wfrule_operand'], $rule['wfrule_number'], $rule['wfrule_number_end']);

			if (count($conflictingRulesByProperties) > 0)
			{
				$routes = $this->wfActionGateway->find('wfrule_id = ?', [$wfrule_id]);

				foreach ($routes as $route) {
					$originator_tablekey_id = $route['wfaction_originator_tablekey_id'];
					$originator_tablename = $route['wfaction_originator_tablename'];

					if ($originator_tablename == 'role') {
						$originatorUserRoleConflicts = $this->wfActionGateway->findOriginatorUserRolesConflicts($wfrule_id, $conflictingRulesByProperties, $originator_tablekey_id);
						$conflictsRules = array_merge($conflictsRules, $originatorUserRoleConflicts);
					}

					if ($originator_tablename == 'userprofilerole') {
						$originatorConflicts = $this->wfActionGateway->findOriginatorUserprofileConflicts($wfrule_id, $conflictingRulesByProperties, $originator_tablekey_id);
						$conflictsRules = array_merge($conflictsRules, $originatorConflicts);

						if (!count($conflictsRules)) {
							$userprofile = $this->wfRuleGateway->findUserProfileById($originator_tablekey_id);
							$originator_tablekey_id = $userprofile[0]['role_id'];
						}
					}

					if (!count($conflictsRules)) {
						$originatorRoleConflicts = $this->wfActionGateway->findOriginatorRolesConflicts($wfrule_id, $conflictingRulesByProperties, $originator_tablekey_id);
						$conflictsRules = array_merge($conflictsRules, $originatorRoleConflicts);
					}
				}
			}


			$conflictsRules = array_unique($conflictsRules);

			if (count($conflictsRules)) {
				switch ($rule['wfruletype_id']) {
					case WFRuleTypeGateway::BUDGET_AMOUNT_BY_GL_CODE:
					case WFRuleTypeGateway::INVOICE_BY_GL_CODE:
					case WFRuleTypeGateway::PURCHASE_ORDER_BY_GL_CODE:
					case WFRuleTypeGateway::BUDGET_AMOUNT_BY_GL_CATEGORY:
					case WFRuleTypeGateway::INVOICE_BY_GL_CATEGORY:
					case WFRuleTypeGateway::PURCHASE_ORDER_BY_GL_CATEGORY:
					case WFRuleTypeGateway::YEARLY_BUDGET_BY_GL_CODE:
					case WFRuleTypeGateway::YEARLY_BUDGET_BY_GL_CATEGORY:
					case WFRuleTypeGateway::YTD_BUDGET_PERCENT_OVERAGE_BY_GL_CODE:
					case WFRuleTypeGateway::YTD_BUDGET_PERCENT_OVERAGE_BY_GL_CATEGORY:
					case WFRuleTypeGateway::MTD_BUDGET_PERCENT_OVERAGE_BY_GL_CODE:
					case WFRuleTypeGateway::MTD_BUDGET_PERCENT_OVERAGE_BY_GL_CATEGORY:
					case WFRuleTypeGateway::YTD_BUDGET_OVERAGE_BY_GL_CODE:
					case WFRuleTypeGateway::YTD_BUDGET_OVERAGE_BY_GL_CATEGORY:
					case WFRuleTypeGateway::RECEIPT_ITEM_TOTAL_BY_GL_CODE:
					case WFRuleTypeGateway::RECEIPT_ITEM_TOTAL_BY_GL_CATEGORY:
						$duplicateByOptions = $this->wfRuleScopeGateway->getDuplicateRulesByOptions($wfrule_id, $conflictsRules, 'glaccount');
						$conflictsRules = \NP\util\Util::valueList($duplicateByOptions, 'wfrule_id');
						break;
					case WFRuleTypeGateway::PO_ITEM_AMOUNT_BY_DEPARTMENT:
					case WFRuleTypeGateway::INVOICE_ITEM_AMOUNT_BY_DEPARTMENT:
						$duplicateByOptions = $this->wfRuleScopeGateway->getDuplicateRulesByOptions($wfrule_id, $conflictsRules, 'unit');
						$conflictsRules = \NP\util\Util::valueList($duplicateByOptions, 'wfrule_id');
						break;
					case WFRuleTypeGateway::SPECIFIC_VENDOR:
					case WFRuleTypeGateway::SPECIFIC_VENDOR_MASTER_RULE:
						$duplicateByOptions = $this->wfRuleScopeGateway->getDuplicateRulesByOptions($wfrule_id, $conflictsRules, 'vendor');
						$conflictsRules = \NP\util\Util::valueList($duplicateByOptions, 'wfrule_id');
						break;
					case WFRuleTypeGateway::INVOICE_BY_CONTRACT_CODE:
					case WFRuleTypeGateway::PURCHASE_ORDER_BY_CONTRACT_CODE:
					case WFRuleTypeGateway::INVOICE_BY_CONTRACT_CODE_MASTER:
					case WFRuleTypeGateway::PURCHASE_ORDER_BY_CONTRACT_CODE_MASTER:
						$allContractsRes = $this->wfRuleScopeGateway->find("wfrule_id = ? AND table_name = ? AND tablekey_id = ?", [$wfrule_id, "'jbcontract'", 0]);
						if (count($allContractsRes) == 0) {
							$duplicateByOptions = $this->wfRuleScopeGateway->getDuplicateRulesByOptions($wfrule_id, $conflictsRules, 'jbcontract');
							$conflictsRulesByOptions = \NP\util\Util::valueList($duplicateByOptions, 'wfrule_id');

							$rulePlaceHolders = $this->wfRuleScopeGateway->createPlaceholders($conflictsRules);
							$where = Where::get()->in('wfrule_id', $rulePlaceHolders)
								->equals('table_name', "'jbcontract'")
								->equals('tablekey_id', 0);
							$duplicateByAllContracts = $this->wfRuleScopeGateway->find($where, [$conflictsRules], null, ['wfrule_id']);
							$conflictsRulesByAllContracts = \NP\util\Util::valueList($duplicateByAllContracts, 'wfrule_id');
							$conflictsRules = array_merge($conflictsRulesByOptions, $conflictsRulesByAllContracts);
						}
						break;
					case WFRuleTypeGateway::INVOICE_BY_GL_JOB_CODE:
					case WFRuleTypeGateway::PURCHASE_ORDER_BY_GL_JOB_CODE:
						$duplicateByOptions = $this->wfRuleScopeGateway->getDuplicateRulesByOptions($wfrule_id, $conflictsRules, 'jbjobcode');
						$conflictsRules = \NP\util\Util::valueList($duplicateByOptions, 'wfrule_id');
						break;
					case WFRuleTypeGateway::INVOICE_TOTAL_BY_PAY_BY:
						$duplicateByOptions = $this->wfRuleScopeGateway->getDuplicateRulesByOptions($wfrule_id, $conflictsRules, 'invoicepaymenttype');
						$conflictsRules = \NP\util\Util::valueList($duplicateByOptions, 'wfrule_id');
						break;
				}
			}
		}

		$conflictsRules = array_unique($conflictsRules);
		$result = (count($conflictsRules)) ? $this->wfRuleGateway->getConflictingRulesById($conflictsRules) : [];

		return $result;
	}


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