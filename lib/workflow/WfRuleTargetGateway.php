<?php

namespace NP\workflow;

use NP\core\AbstractGateway;
use NP\core\db\Insert;
use NP\core\db\Select;
use NP\core\db\Expression;

/**
 * Gateway for the WFRULETARGET table
 *
 * @author Thomas Messier
 */
class WfRuleTargetGateway extends AbstractGateway {

	public function addActivatedPropertiesToRules($property_id_list) {
		$insert = new Insert();
		$select = new Select();
		$subSelect = new Select();

		$propertyPlaceHolders = $this->createPlaceholders($property_id_list);

		$insert->into('wfruletarget')
				->columns(array('wfrule_id', 'table_name', 'tablekey_id'))
				->values(
					$select->columns(array('wfrule_id', new Expression("'property'")))
							->from(array('w'=>'wfrule'))
							->join(array('p'=>'property'),
									null,
									array('property_id'),
									Select::JOIN_CROSS)
							->whereEquals('w.isAllPropertiesWF', 1)
							->whereIn('p.property_id', $propertyPlaceHolders)
							->whereNotExists(
								$subSelect->from(array('w2'=>'wfruletarget'))
												->whereEquals('w2.wfrule_id', 'w.wfrule_id')
												->whereEquals('w2.tablekey_id', 'p.property_id')
												->whereEquals('w2.table_name', "'property'")
							)
				);

		return $this->adapter->query($insert, $property_id_list);
	}
}

?>