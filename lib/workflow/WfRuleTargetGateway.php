<?php

namespace NP\workflow;

use NP\core\AbstractGateway;
use NP\core\db\Insert;
use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Expression;

/**
 * Gateway for the WFRULETARGET table
 *
 * @author Thomas Messier
 */
class WfRuleTargetGateway extends AbstractGateway {

	/**
	 * Adds a property or list of properties as rule targets for workflow rules that are set for "All Properties"
	 *
	 * @param  array|int $property_id_list The property or properties to add
	 * @return boolean                     Whether or not the operation was successful
	 */
	public function addActivatedPropertiesToRules($property_id_list) {
		$insert = new Insert();
		$select = new Select();
		$subSelect = new Select();

		// If $property_id_list is not an array, we're dealing with a single property, just make it an array
		// for consistency
		if (!is_array($property_id_list)) {
			$property_id_list = array($property_id_list);
		}

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

    public function copy($ruleid, $targetid) {
        $select = Select::get()
            ->columns([
                new \NP\core\db\Expression($ruleid),
                'table_name',
                'tablekey_id'
            ])
            ->from('wfruletarget')
            ->where(
                Where::get()
                    ->equals('wfrule_id', $targetid)
            )
        ;
        $insert = \NP\core\db\Insert::get()
            ->into('wfruletarget')
            ->columns([
                'wfrule_id',
				'table_name',
                'tablekey_id'
            ])
            ->values($select)
        ;
        $this->adapter->query($insert);
    }


	public function addAllPropertiesToRules($wfrule_id, $tablename, $asp_client_id, $property_status_list) {
		$insert = new Insert();
		$select = new Select();
		$subSelect = new Select();

		if (!is_array($property_status_list)) {
			$property_status_list = array($property_status_list);
		}

		$statusPlaceHolders = $this->createPlaceholders($property_status_list);

		$insert->into('wfruletarget')
			->columns(['wfrule_id', 'table_name', 'tablekey_id'])
			->values(
				$select->columns([new Expression($wfrule_id), new Expression("'{$tablename}'"), 'property_id'])
					->from(['p'  => 'property'])
					->join(['ip' => 'integrationpackage'], 'ip.integration_package_id = p.integration_package_id', [], Select::JOIN_INNER)
					->whereEquals('ip.asp_client_id', $asp_client_id)
					->whereIn('p.property_status', $statusPlaceHolders)
					->whereNotIn('p.property_id',
						$subSelect->distinct()
							->columns(['tablekey_id'])
							->from(['w2' => 'wfruletarget'])
							->whereEquals('w2.wfrule_id', $wfrule_id)
					)
			);

		return $this->adapter->query($insert, $property_status_list);
	}

	public function deleteWFRuleTarget($wfrule_id, $ignore_tablekey_id_list) {
		$delete = new Delete();

		$delete->from('wfruletarget')
				->whereEquals('wfrule_id', $wfrule_id);

		if (is_array($ignore_tablekey_id_list) && count($ignore_tablekey_id_list)) {
			$delete->whereNotIn('tablekey_id', $ignore_tablekey_id_list);
		}

		return $this->adapter->query($delete);
	}

	/**
	 * Add properties by region id
	 *
	 * @param $wfrule_id (int) - Workflow rule id
	 * @param $region_id (int) - region id
	 */
	public function addPropertiesByRegion($wfrule_id, $region_id) {
		$insert = new Insert();
		$select = new Select();

		$insert->into('wfruletarget')
				->columns(array('wfrule_id', 'table_name', 'tablekey_id'))
				->values(
					$select->columns([new Expression($wfrule_id), new Expression("'property'"), 'property_id'])
						   ->from('property')
						   ->whereEquals('region_id', $region_id)
				);

		return $this->adapter->query($insert, [$region_id]);
	}
}