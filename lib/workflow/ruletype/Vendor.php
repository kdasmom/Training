<?php
namespace NP\workflow\ruletype;

use NP\core\GatewayManager;

/**
 * TotalAmount rule type
 *
 * @author Thomas Messier
 */
class Vendor extends AbstractRuleType implements RuleTypeInterface {
	
	public function isActive(\NP\workflow\WorkflowableInterface $entity, \NP\workflow\WFRuleEntity $rule) {
		$scope = $rule->getScope();

		$fields = $entity->getFields();
		$vendorsiteField = (array_key_exists('paytablekey_id', $fields)) ? 'paytablekey_id' : 'vendorsite_id';
		
		if (array_key_exists($entity->$vendorsiteField, $scope)) {
			if (
				$this->valueExceedsThreshold(
					$rule->wfrule_operand,
					$rule->wfrule_number,
					$rule->wfrule_number_end,
					$entity->getAmount()
				)
			) {
				return true;
			}
		}

		return false;
	}

	public function getScope($wfrule_id) {
		$vendors = $this->gatewayManager->get('WfRuleScopeGateway')->find(
			'wfrule_id = ?',
			[$wfrule_id],
			null,
			[],
			null,
			null,
			[
				new \NP\core\db\Join(
					['v'=>'vendor'],
					'wfrulescope.tablekey_id = v.vendor_id',
					[]
				),
				new \NP\vendor\sql\join\VendorVendorsiteJoin(['vendorsite_id'])
			]
		);

		return \NP\util\Util::valueList($vendors, 'vendorsite_id', true);
	}

	public function isLineRule() {
		return false;
	}

	public function getDescription() {
		return '{entity} Order total exceeds amount for this vendor.';
	}
}

?>