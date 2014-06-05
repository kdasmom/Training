<?php
namespace NP\workflow;

use NP\core\AbstractService;

use NP\system\ConfigService;
use NP\security\SecurityService;
use NP\invoice\InvoiceService;
use NP\po\PoService;
use NP\po\ReceiptService;
use NP\notification\NotificationService;

use NP\workflow\WfRuleGateway;
use NP\user\UserprofileGateway;
use NP\core\db\Where;

class WFRuleService extends AbstractService {
    protected $configService, $securityService, $invoiceService, $poService, $receiptService, $notificationService;

    protected $ruleTypeMap = [
		1  => 'TotalAmount',
		2  => 'TotalAmount',
		3  => 'BudgetByGl',
		4  => 'Delegation',
		5  => 'ApprovalNotifcation',
		6  => 'Vendor',
		7  => 'ItemByGl',
		8  => 'ItemByGl',
		9  => 'BudgetByGlCategory',
		10 => 'ItemByGlCategory',
		11 => 'ItemByGlCategory',
		12 => 'BudgetOverageNotification',
		13 => 'YearlyBudgetByGl',
		14 => 'YearlyBudgetByGlCategory',
		15 => 'OptionalWorkflow',
		16 => 'Vendor',
		20 => 'ConvertedInvoice',
		21 => 'ItemByJob',
		22 => 'ItemByJob',
		23 => 'TotalAmount',
		24 => 'ItemByContract',
		25 => 'ItemByContract',
		26 => 'ItemByContract',
		27 => 'ItemByContract',
		28 => 'InvoiceTotalByPayBy',
		29 => 'YtdBudgetPctByGl',
		30 => 'YtdBudgetPctByGlCategory',
		31 => 'MtdBudgetPctByGl',
		32 => 'MtdBudgetPctByGlCategory',
		33 => 'YtdBudgetByGl',
		34 => 'YtdBudgetByGlCategory',
		35 => 'ItemByDept',
		36 => 'ItemByDept',
		37 => 'ItemByGl',
		38 => 'ItemByGlCategory'
    ];

    public function __construct(InvoiceService $invoiceService, PoService $poService, ReceiptService $receiptService,
    							NotificationService $notificationService) {
		$this->invoiceService      = $invoiceService;
		$this->poService           = $poService;
		$this->receiptService      = $receiptService;
		$this->notificationService = $notificationService;
    }

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
			$incompleteRules= [];

			if ($status == 1) {
				$rulesWithConflictsIdList = [];
				$incompleteRulesIdList = [];

				foreach ($id as $ruleid) {
					$conflictingRules = $this->findConflictingRules($ruleid);
					if (count($conflictingRules)) {
						$rulesWithConflictsIdList[] = $ruleid;
					}

					$routes = $this->GetRuleRoutes($ruleid);
					if (!count($routes)) {
						$incompleteRulesIdList[] = $ruleid;
					}

					if (!count($conflictingRules) && count($routes)) {
						$this->wfRuleGateway->setRuleStatus($ruleid, $status);
					}
				}
				if (count($rulesWithConflictsIdList) > 0) {
					$rulesWithConflicts = $this->wfRuleGateway->find(
						Where::get()->in('wfrule_id', implode(',', $rulesWithConflictsIdList))
					);
				}
				if (count($incompleteRulesIdList) > 0) {
					$incompleteRules = $this->wfRuleGateway->find(
						Where::get()->in('wfrule_id', implode(',', $incompleteRulesIdList))
					);
				}
			}
			else {
				foreach ($id as $ruleid) {
					$this->wfRuleGateway->setRuleStatus($ruleid, $status);
				}
			}
			return [
				'success'            => true,
				'rulesWithConflicts' => $rulesWithConflicts,
				'incompleteRules'    => $incompleteRules
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
		$routes = $this->GetRuleRoutes($ruleid);
		$conflictingRules = $this->findConflictingRules($ruleid);

		if (!count($conflictingRules) && count($routes)) {
			$dataSet = [
				'wfrule_id'     => $ruleid,
				'wfrule_status' => 'active'
			];
			$this->wfRuleGateway->save($dataSet);
		}

		return [
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

	public function requiresApproval($table_name, $tablekey_id) {
		$userprofile_id = $this->securityService->getUserId();

		// Determine the property classes to use based on the entity type
		$entityVars = $this->getEntityVars($table_name);

		$entityData = $this->$entityVars['service']->get($tablekey_id);
		$entity = new $entityVars['class']($entityData);
		$entity->setLines($entityData['lines']);
		$rules = $this->getActiveRules($entity, $userprofile_id, true);

		return (count($rules) > 0);
	}

	public function getActiveRules(\NP\workflow\WorkflowableInterface $entity, $userprofile_id, $firstOnly=false) {
		// Get rules that are applicable to this particular entity and user
		$rules = $this->wfRuleGateway->findPossibleRules($entity, $userprofile_id);

		// Track rules that test active
		$activeRules = [];

		$fields      = array_keys($entity->getFields());
		$pkField     = $fields[0];
		$tablekey_id = $entity->$pkField;
		$table_name  = str_replace('_id', '', $pkField);

		// Check if any master rule has already been approved for this entity
		$hasMasterApproval = $this->approveGateway->hasMasterRuleApproval($table_name, $tablekey_id);

		// Loop through rules
		foreach ($rules as $rule) {
			// Only check the rule if there has been no master rule approval or if the rule
			// is a master rule
			if (!$hasMasterApproval || $rule['ismaster'] == 1) {
				// Get properties assigned to the rule
				$properties  = $this->wfRuleTargetGateway->find('wfrule_id = ?', [$rule['wfrule_id']], null, ['tablekey_id']);
				$properties  = \NP\util\Util::valueList($properties, 'tablekey_id', true);

				// Create rule entity object
				$ruleEntity  = new WFRuleEntity($rule);

				// Create rule type object
				$ruleType = $this->ruleTypeMap[$rule['type_id_alt']];
				$ruleType = "NP\\workflow\\ruletype\\{$ruleType}";

				if ($entity instanceOf \NP\po\PoEntity) {
					$entityService = $this->poService;
				} else if ($entity instanceOf \NP\invoice\InvoiceEntity) {
					$entityService = $this->invoiceService;
				} else if ($entity instanceOf \NP\receipt\ReceiptEntity) {
					$entityService = $this->receiptService;
				}

				$ruleType = new $ruleType($this->gatewayManager, $this->configService, $entityService);

				// Get the scope and add it to the rule entity
				$scope = $ruleType->getScope($rule['wfrule_id']);
				$ruleEntity->setScope($scope);

				// Determine entity(ies) you're going to test against the rules (header or lines)
				$entities = ($ruleType->isLineRule()) ? $entity->getLines() : [$entity];

				// Loop through entities (if dealing with header, will always be just one)
				foreach ($entities as $obj) {
					// Test rule against the entity
					if (array_key_exists($obj->property_id, $properties) && $ruleType->isActive($obj, $ruleEntity)) {
						// If workflow is needed, add to the list of rules
						$activeRules[] = [
							'rule'     => $ruleEntity,
							'ruleType' => $ruleType,
							'entity'   => $obj
						];
						if ($firstOnly) {
							return $activeRules;
						}
					}
				}
			}
		}

		// Return all active rules
		return $activeRules;
	}

	private function getEntityVars($table_name) {
		if ($table_name == 'purchaseorder') {
			$entityClass = 'NP\\po\\PurchaseOrderEntity';
			$service     = 'poService';
			$displayName = 'Purchase Order';
			$gateway     = 'PurchaseOrder';
		} else if ($table_name == 'invoice') {
			$entityClass = 'NP\\invoice\\InvoiceEntity';
			$service     = 'invoiceService';
			$displayName = 'Invoice';
			$gateway     = $displayName;
		} else if ($table_name == 'receipt') {
			$entityClass = 'NP\\receipt\\ReceiptEntity';
			$service     = 'receiptService';
			$displayName = 'Receipt';
			$gateway     = $displayName;
		}

		return [
			'class'       => $entityClass,
			'service'     => $service,
			'displayName' => $displayName,
			'gateway'     => "{$gateway}Gateway"
		];
	}

	/**
	 * Submits an entity for approval
	 */
	public function submitForApproval($table_name, $tablekey_id, $userprofile_id=null, $delegation_to_userprofile_id=null, $isAuto=false, $nestLevel=0) {
		if ($userprofile_id === null) {
			$userprofile_id = $this->securityService->getUserId();
		}

		if ($delegation_to_userprofile_id === null) {
			$delegation_to_userprofile_id = $this->securityService->getDelegatedUserId();
		}

		// Determine the property classes to use based on the entity type
		$entityVars = $this->getEntityVars($table_name);

		$errors = [];
		$this->approveGateway->beginTransaction();
		
		try {
			$entityData = $this->$entityVars['service']->get($tablekey_id);
			$entity     = new $entityVars['class']($entityData);
			$entity->setLines($entityData['lines']);

			// Find rules that apply for this entity and user
			$rules = $this->getActiveRules($entity, $userprofile_id, false);

			// Loop through rules that were triggered
			foreach ($rules as $rule) {
				$rule_id = $rule['rule']->wfrule_id;

				// Get routes for the current rule
				$routes  = $this->wfActionGateway->findRoutesByRuleAndUser($rule_id, $userprofile_id);

				// Loop through routes
				foreach ($routes as $route) {
					// If set to route to next level, figure out which role is the next level up
					if ($route['wfaction_nextlevel'] == 'Y') {
						$route['wfaction_receipient_tablename']   = 'role';
						$route['wfaction_receipient_tablekey_id'] = $this->userprofileGateway->findUserParentRole($userprofile_id);
					}

					// Get the submitted approve type to be used on the approve record
					$approvetype_id = $this->approveTypeGateway->getIdByName('submitted');

					// Get the message from the rule type
					$msg = $rule['ruleType']->getDescription();
					$msg = str_replace('{entity}', $entityVars['displayName'], $msg);
					
					// Determine the unit_id if appropriate
					$unit_id = null;
					if (array_key_exists('unit_id', $rule['entity']->getFields())) {
						$unit_id = $rule['entity']->unit_id;
					}

					// Determine the glaccount_id if appropriate
					$glaccount_id = null;
					if (array_key_exists('glaccount_id', $rule['entity']->getFields())) {
						$glaccount_id = $rule['entity']->glaccount_id;
					}

					// Determine the wfruletarget_id if appropriate
					$wfruletarget_id = $this->wfRuleTargetGateway->findValue(
						['wfrule_id' => '?', 'tablekey_id' => '?'],
						[$rule_id, $rule['entity']->property_id],
						'wfruletarget_id'
					);

					$this->addRoute(
						$table_name, $tablekey_id, $userprofile_id, $delegation_to_userprofile_id, 
						$route['wfaction_receipient_tablename'], $route['wfaction_receipient_tablekey_id'],
						[
							'approve_message' => $msg,
							'wfrule_id'       => $rule_id,
							'wfaction_id'     => $wfaction_id,
							'glaccount_id'    => $glaccount_id,
							'wftarget_id'     => $wfruletarget_id,
							'unit_id'         => $unit_id
						]
					);
				}
			}

			$gtw         = $entityVars['gateway'];
			$pkField     = "{$table_name}_id";
			$statusField = "{$table_name}_status";

			// Update the entity status to forapproval
			$this->$gtw->update([
				$pkField     => $tablekey_id,
				$statusField => 'forapproval'
			]);

			// See if anything that got submitted can be auto-approved
			$this->autoApprove($table_name, $tablekey_id, $userprofile_id, $delegation_to_userprofile_id, $nestLevel);
		} catch(\Exception $e) {
			$errors[] = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->approveGateway->rollback();
		} else {
			$this->approveGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	/**
	 * Approves an entity for the current user
	 */
	public function approve($table_name, $tablekey_id, $userprofile_id=null, $delegation_to_userprofile_id=null, $isAuto=false, $nestLevel=0) {
		if ($userprofile_id === null) {
			$userprofile_id = $this->securityService->getUserId();
		}

		if ($delegation_to_userprofile_id === null) {
			$delegation_to_userprofile_id = $this->securityService->getDelegatedUserId();
		}

		// Get all approvable items by the current user for this entity
		$approvables = $this->approveGateway->findApprovableRecords(
			$table_name,
			$tablekey_id,
			$userprofile_id,
			$delegation_to_userprofile_id
		);

		// Get the "approved" approve type for the approve record
		$approvetype_id = $this->approveTypeGateway->getIdByName('approved');

		$errors = [];
		$this->approveGateway->beginTransaction();
		
		try {
			// Loop through approvable items to approve them one by one
			foreach ($approvables as $approvable) {
				// If this is being approved via delegation, we save a different message on
				// the approve record
				$msg = '';
				if ($userprofile_id != $delegation_to_userprofile_id) {
					$user    = $this->userprofileGateway->findById($userprofile_id, ['userprofile_username']);
					$delUser = $this->userprofileGateway->findById($delegation_to_userprofile_id, ['userprofile_username']);

					$msg = " ({$user['userprofile_username']} approved on behalf of {$delUser['userprofile_username']})";
				}

				// Create the approve entity used to save the approve record
				$approve = new \NP\workflow\ApproveEntity([
					'table_name'                   => $table_name,
					'tablekey_id'                  => $tablekey_id,
					'userprofile_id'               => $userprofile_id,
					'delegation_to_userprofile_id' => $delegation_to_userprofile_id,
					'approve_message'              => $msg,
					'approvetype_id'               => $approvetype_id,
					'budget_id'                    => $approvable['budget_id'],
					'budget_variance'              => $approvable['budget_variance'],
					'wfrule_id'                    => $approvable['wfrule_id'],
					'auto_approve'                 => ($isAuto) ? 1 : 0,
					'glaccount_id'                 => $approvable['glaccount_id'],
					'wftarget_id'                  => $approvable['wftarget_id'],
					'transaction_id'               => $this->approveGateway->currentId()
				]);

				// Validate and save the approve record
				$errors = $this->entityValidator->validate($approve);
				if (!count($errors)) {
					$this->approveGateway->save($approve);
				} else {
					$this->loggingService->log('error', 'Error validating approve entity while submitting entity for approval', $errors);
					throw new \NP\core\Exception('Error submitting entity for approval');
				}

				// Inactivate the submitted workflow rule that was just approved
				$this->approveGateway->update([
					'approve_id'     => $approvable['approve_id'],
					'approve_status' => 'inactive'
				]);
			}

			// Add a status alert for approving the entity
			if ($table_name == 'purchaseorder') {
				$this->notificationService->addStatusAlert($tablekey_id, 'Status Alert: PO Approved');
			} else if ($table_name == 'invoice') {
				$this->notificationService->addStatusAlert($tablekey_id, 'Invoice Approved');
			}

			// If this isn't an auto-approval, submit the entity for approval again
			// based on the current user
			if (!$isAuto) {
				// Minimize the amount of recursion in case an infinite loop happens due to a bug
				// We don't want the server to crash on account of that
				if ($nestLevel <= 15) {
					$nestLevel++;
					// Submit entity for approval by the user who just approved it
					$result = $this->submitForApproval($table_name, $tablekey_id, $userprofile_id, $delegation_to_userprofile_id, $isAuto, $nestLevel);
					if (!$result['success']) {
						throw new \NP\core\Exception('Error submitting entity for approval after approving it');
					}
				} else {
					throw new \NP\core\Exception('Too much recursion approving an entity, must be a bug in workflow');
				}
			}

			// If entity is fully approved, change it to a new status
			if (!$this->approveGateway->hasPendingApprovals($table_name, $tablekey_id)) {
				// If dealing with a PO, release the PO
				if ($table_name == 'purchaseorder') {
					$this->poService->releasePo($tablekey_id);
				}
				// If dealing with an invoice, status change depends on setting
				else if ($table_name == 'invoice') {
					$skipSave = $this->configService->get('PN.InvoiceOptions.SKIPSAVE', '0');

					// Status we are going to set the invoice to depends on the SKIPSAVE setting
					if ($skipSave == 1) {
						$this->invoiceGateway->update([
							'invoice_id'            => $tablekey_id,
							'invoice_status'        => 'submitted',
							'invoice_submitteddate' => \NP\util\Util::formatDateForDB()
						]);
					} else {
						$this->invoiceGateway->update([
							'invoice_id'     => $tablekey_id,
							'invoice_status' => 'saved'
						]);
					}

					// Add a status alert for completing the invoice
					$this->notificationService->addStatusAlert($tablekey_id, 'Status Alert: Invoice Completed');
				}
			}
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->approveGateway->rollback();
		} else {
			$this->approveGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	/**
	 * Rejects an entity
	 */
	public function reject($table_name, $tablekey_id, $rejectionnote_id, $reject_note) {
		$entityVars = $this->getEntityVars($table_name);
		$gtw        = $entityVars['gateway'];

		$errors = [];
		$this->$gtw->beginTransaction();
		
		try {
			$now                          = \NP\util\Util::formatDateForDB();
			$userprofile_id               = $this->securityService->getUserId();
			$delegation_to_userprofile_id = $this->securityService->getDelegatedUserId();

			$entity = $this->$gtw->findSingle(
				"{$table_name}_id = ?",
				[$tablekey_id],
				["{$table_name}_status","{$table_name}_reject_note"]
			);
			$newStatus = 'rejected';

			// If there's an existing note, prepend it to the new one
			$entity_reject_note = $entity["{$table_name}_reject_note"];
			if (!empty($entity_reject_note)) {
				$reject_note = "{$entity_reject_note}<br />$reject_note";
			}

			// Update the invoice record with the new status and note
			$this->$gtw->update([
				"{$table_name}_id"          => $tablekey_id,
				"{$table_name}_status"      => $newStatus,
				"{$table_name}_reject_note" => $reject_note
			]);

			// Audit the status change
			$this->$entityVars['service']->audit([
				'tablekey_id'                  => $tablekey_id,
				'userprofile_id'               => $userprofile_id,
				'delegation_to_userprofile_id' => $delegation_to_userprofile_id,
				'field_name'                   => "{$table_name}_status",
				'field_new_value'              => $entity["{$table_name}_status"],
				'field_old_value'              => $newStatus
			], $table_name, $newStatus);

			$approvetype_id = $this->approveTypeGateway->getIdByName('rejected');

			// If entity is pending approval, run this
			if ($entity["{$table_name}_status"] == 'forapproval') {
				$msg = 'Invoice Rejected';
				if ($userprofile_id != $delegation_to_userprofile_id) {
					$user    = $this->userprofileGateway->findById($userprofile_id, ['userprofile_username']);
					$delUser = $this->userprofileGateway->findById($delegation_to_userprofile_id, ['userprofile_username']);

					$msg = " ({$user['userprofile_username']} approved on behalf of {$delUser['userprofile_username']})";
				}

				// Save an approve record
				$approve = new \NP\workflow\ApproveEntity([
					'table_name'                   => $table_name,
					'tablekey_id'                  => $tablekey_id,
					'userprofile_id'               => $userprofile_id,
					'delegation_to_userprofile_id' => $delegation_to_userprofile_id,
					'approve_message'              => $msg,
					'approvetype_id'               => $approvetype_id,
					'transaction_id'               => $this->approveGateway->currentId()
				]);

				$errors = $this->entityValidator->validate($approve);
				if (count($errors)) {
					$this->loggingService->log('global', 'Invalid approve record', $errors);
					throw new \NP\core\Exception('Error saving approve record while post rejecting an invoice');
				}

				$this->approveGateway->save($approve);

				$submit_approvetype_id = $this->approveTypeGateway->getIdByName('submitted');
				$this->approveGateway->update(
					['approve_status' => 'inactive'],
					[
						'table_name'     => '?',
						'tablekey_id'    => '?',
						'approvetype_id' => $submit_approvetype_id
					],
					[$table_name, $tablekey_id]
				);
			}
			// If entity is not pending (only happens with invoices), this is a post approve rejection
			else {
				// Save an approve record
				$approve = new \NP\workflow\ApproveEntity([
					'table_name'                   => $table_name,
					'tablekey_id'                  => $tablekey_id,
					'userprofile_id'               => $userprofile_id,
					'delegation_to_userprofile_id' => $delegation_to_userprofile_id,
					'approve_message'              => $reject_note,
					'approvetype_id'               => $approvetype_id,
					'transaction_id'               => $this->approveGateway->currentId()
				]);

				$errors = $this->entityValidator->validate($approve);
				if (count($errors)) {
					$this->loggingService->log('global', 'Invalid approve record', $errors);
					throw new \NP\core\Exception('Error saving approve record while post rejecting an invoice');
				}

				$this->approveGateway->save($approve);
			}

			// Save a message (TM NOTE: no idea why this is needed or where it's used)
			$messagetype_id = $this->messageGateway->findMessageType('alert');
			$message = new \NP\system\MessageEntity([
				'messagetype_id'     => $messagetype_id,
				'table_name'         => $table_name,
				'tablekey_id'        => $tablekey_id,
				'message_text'       => $reject_note,
				'message_flagstatus' => 'rejected'
			]);

			$errors = $this->entityValidator->validate($message);
			if (count($errors)) {
				$this->loggingService->log('global', 'Invalid message record', $errors);
				throw new \NP\core\Exception('Error saving message record while post rejecting an invoice');
			}

			$this->messageGateway->save($message);

			// Save a rejection history record (again, not sure why we need records in so many tables)
			$rejection = new \NP\shared\RejectionHistoryEntity([
				'rejectionnote_id'           => $rejectionnote_id,
				'table_name'                 => $table_name,
				'tablekey_id'                => $tablekey_id,
				'userprofile_id'             => $userprofile_id
			]);

			$errors = $this->entityValidator->validate($rejection);
			if (count($errors)) {
				$this->loggingService->log('global', 'Invalid rejectionhistory record', $errors);
				throw new \NP\core\Exception('Error saving rejectionhistory record while post rejecting an invoice');
			}

			$this->rejectionHistoryGateway->save($rejection);

			// Audit the note change
			$this->$entityVars['service']->audit([
				'tablekey_id'                  => $tablekey_id,
				'userprofile_id'               => $userprofile_id,
				'delegation_to_userprofile_id' => $delegation_to_userprofile_id,
				'field_name'                   => "{$table_name}_reject_note",
				'field_new_value'              => $reject_note,
				'field_old_value'              => $entity["{$table_name}_reject_note"]
			], $table_name, 'modified');
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->$gtw->rollback();
		} else {
			$this->$gtw->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	/**
	 * Submit an entity for approval and also 
	 */
	public function submitForApprovalAndRoute($table_name, $tablekey_id, $users) {
		$errors = [];
		$this->approveGateway->beginTransaction();
		
		try {
			$result = $this->route($table_name, $tablekey_id, $users);

			if (!$result['success']) {
				$this->loggingService->log('error', 'Error manually routing entity to users', $result['errors']);
				throw new \NP\core\Exception('Error submitting for approval and routing');
			}

			$result = $this->submitForApproval($table_name, $tablekey_id);
			if (!$result['success']) {
				$this->loggingService->log('error', 'Error submitting entity for approval', $result['errors']);
				throw new \NP\core\Exception('Error submitting for approval and routing');
			}
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->approveGateway->rollback();
		} else {
			$this->approveGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	/**
	 * Manually routes an entity to one or more users
	 */
	public function route($table_name, $tablekey_id, $users) {
		$userprofile_id               = $this->securityService->getUserId();
		$delegation_to_userprofile_id = $this->securityService->getDelegatedUserId();
		$entityVars                   = $this->getEntityVars($table_name);

		$wfaction = $this->wfActionGateway->findTriggeredOptionalRuleAction($userprofile_id);

		$errors = [];
		$this->approveGateway->beginTransaction();
		
		try {
			$gtw         = $entityVars['gateway'];
			$pkField     = "{$table_name}_id";
			$statusField = "{$table_name}_status";

			$this->$gtw->update([
				$pkField     => $tablekey_id,
				$statusField => 'forapproval'
			]);

			foreach ($users as $userprofilerole_id) {
				$this->addRoute(
					$table_name, $tablekey_id, $userprofile_id, $delegation_to_userprofile_id, 
					'userprofilerole', $userprofilerole_id,
					[
						'wfrule_id'       => ($wfaction !== null) ? $wfaction['wfrule_id'] : null,
						'wfaction_id'     => ($wfaction !== null) ? $wfaction['wfaction_id'] : null,
						'approve_message' => "{$entityVars['displayName']} optional workflow."
					]
				);
			}
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->approveGateway->rollback();
		} else {
			$this->approveGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	/**
	 * Routes an entity to one or more specified users
	 */
	private function addRoute(
		$table_name, $tablekey_id, $userprofile_id, $delegation_to_userprofile_id, 
		$forwardto_tablename, $forwardto_tablekeyid, $data
	) {
		// Get the submitted approve type to be used on the approve record
		$approvetype_id = $this->approveTypeGateway->getIdByName('submitted');

		// Create the approve entity to be used to save the new record
		$approve = new \NP\workflow\ApproveEntity([
			'table_name'                   => $table_name,
			'tablekey_id'                  => $tablekey_id,
			'approvetype_id'               => $approvetype_id,
			'userprofile_id'               => $userprofile_id,
			'delegation_to_userprofile_id' => $delegation_to_userprofile_id,
			'forwardto_tablename'          => $forwardto_tablename,
			'forwardto_tablekeyid'         => $forwardto_tablekeyid,
			'transaction_id'               => $this->approveGateway->currentId(),
			'approve_message'              => (array_key_exists('approve_message', $data)) ? $data['approve_message'] : null,
			'wfrule_id'                    => (array_key_exists('wfrule_id', $data)) ? $data['wfrule_id'] : null,
			'wfaction_id'                  => (array_key_exists('wfaction_id', $data)) ? $data['wfaction_id'] : null,
			'glaccount_id'                 => (array_key_exists('glaccount_id', $data)) ? $data['glaccount_id'] : null,
			'wftarget_id'                  => (array_key_exists('wftarget_id', $data)) ? $data['wftarget_id'] : null,
			'unit_id'                      => (array_key_exists('unit_id', $data)) ? $data['unit_id'] : null
		]);

		$errors = $this->entityValidator->validate($approve);
		if (count($errors)) {
			throw new \NP\core\Exception('Error adding route');
		}

		$this->approveGateway->save($approve);

		// TODO: Generate email for route (replicate APPROVAL_EMAIL)

	}

	private function autoApprove($table_name, $tablekey_id, $userprofile_id, $delegation_to_userprofile_id, $nestLevel) {
		// Determine the property classes to use based on the entity type
		$entityVars = $this->getEntityVars($table_name);

		$gtw         = $entityVars['gateway'];
		$pkField     = "{$table_name}_id";
		$statusField = "{$table_name}_status";

		if ($this->configService->get('PN.Main.AutoApprove', '0') == 1) {
			$errors = [];
			$this->approveGateway->beginTransaction();
			
			try {
				$skipSave = $this->configService->get('PN.InvoiceOptions.SKIPSAVE', '0');
				$status   = $this->$gtw->findValue([$pkField => '?'], [$tablekey_id], $statusField);

				// Conditions for doing auto-approval
				if (
					(
						$table_name == 'invoice'
						&& !(
							($skipSave == 0 && $status == 'saved')
							|| ($skipSave == 1 && $status == 'submitted')
						)
					)
					|| (
						$table_name == 'purchaseorder'
						&& $status != 'saved'
					)
				) {
					// Find all possible auto approvers
					$approvers = $this->approveGateway->findAutoApprovers($table_name, $tablekey_id);
					
					// Loop trough auto approvers
					foreach ($approvers as $approver) {
						// Auto approve entity with that user
						$result = $this->approve($table_name, $tablekey_id, $approver['userprofile_id'], $approver['delegation_to_userprofile_id'], true, $nestLevel);
						if (!$result['success']) {
							throw new \NP\core\Exception('Error auto approving an entity');
						}
					}
				}

				$this->approveGateway->commit();
			} catch(\Exception $e) {
				$this->approveGateway->rollback();
				throw $e;
			}
		}
	}
}