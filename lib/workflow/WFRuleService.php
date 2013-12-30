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
            'errors'  => $errors
        ];
    }

    public function save($data) {
        
    }

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

    public function status($id, $status) {
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

    public function search($type = 0, $criteria = null, $page = null, $pageSize = null, $order = "wfrule_name") {
        $asp_client_id = $this->configService->getClientId();
        return $this->wfRuleGateway->findRule($asp_client_id, $type, $criteria, $page, $pageSize, $order);
    }

    public function listRulesType() {
        return $this->wfRuleTypeGateway->find(null, [], 'ordinal', ['wfruletype_id', 'wfruletype_name', 'type_id_alt', 'ordinal']);
    }
}