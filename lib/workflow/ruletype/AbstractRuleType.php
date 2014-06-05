<?php
namespace NP\workflow\ruletype;

use NP\core\GatewayManager;
use NP\system\ConfigService;
use NP\shared\AbstractEntityService;

/**
 * Interface for a workflow rule
 *
 * @author Thomas Messier
 */
abstract class AbstractRuleType implements RuleTypeInterface {
	protected $gatewayManager, $configService;

	public function __construct(GatewayManager $gatewayManager, ConfigService $configService, AbstractEntityService $entityService) {
		$this->gatewayManager = $gatewayManager;
		$this->configService  = $configService;
		$this->entityService  = $entityService;
	}

	public function valueExceedsThreshold($op, $wfrule_number, $wfrule_number_end, $amount) {
		if ($op == 'greater than') {
			if ($amount > $wfrule_number) {
				return true;
			}
		} else if ($op == 'greater than or equal to') {
			if ($amount >= $wfrule_number) {
				return true;
			}
		} else if ($op == 'less than') {
			if ($amount < $wfrule_number) {
				return true;
			}
		} else if ($op == 'greater than equal to or less than') {
			return true;
		} else if ($op == 'in range') {
			if ($amount >= $wfrule_number && $amount <= $wfrule_numberEnd) {
				return true;
			}
		}

		return false;
	}

	public function getScope($wfrule_id) {
		$scope = $this->gatewayManager->get('WfRuleScopeGateway')->find(
			'wfrule_id = ?',
			[$wfrule_id],
			null,
			['tablekey_id']
		);

		return \NP\util\Util::valueList($scope, 'tablekey_id', true);
	}

	public function isLineRule() {
		return true;
	}

	abstract public function isActive(\NP\workflow\WorkflowableInterface $entity, \NP\workflow\WFRuleEntity $rule);
}

?>