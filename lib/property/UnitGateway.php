<?php

namespace NP\property;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Update;

/**
 * Gateway for the UNIT table
 *
 * @author Thomas Messier
 */
class UnitGateway extends AbstractGateway {
	protected $tableAlias = 'u';

	/**
	 * Override getSelect() function to add a join to the default data retrieval
	 *
	 * @return NP\core\db\Select
	 */
	public function getSelect() {
		$select = new Select();
		$select->from(array('u'=>'unit'))
				->join(array('ut'=>'unittype'),
						'u.unittype_id = ut.unittype_id',
						array('unittype_id_alt','unittype_name'),
						Select::JOIN_LEFT);

		return $select;
	}

	public function findByStatus($property_id, $unit_status=null, $keyword=null) {
		$select = $this->getSelect()
					->whereEquals('u.property_id', '?')
					->order('u.unit_number');

		$params = [$property_id];
		if ($unit_status !== null) {
			$select->whereEquals('u.unit_status', '?');
			$params[] = $unit_status;
		}

		if ($keyword !== null) {
			$select->whereLike('u.unit_number', '?');
			$params[] = $keyword . '%';
		}

		return $this->adapter->query($select, $params);
	}

	/**
	 * Removes a unit from a property
	 *
	 * @param   array|int $unit_id An array of unit Ids or a single unit Id to remove
	 */
	public function removeUnits($unit_id) {
		// If dealing with an array, use an IN clause
		if (is_array($unit_id)) {
			$update = new Update();
			$update->table('unit')
					->value('unit_status', "'Inactive'")
					->whereIn('unit_id', $this->createPlaceholders($unit_id));
			
			$this->adapter->query($update, $unit_id);
		// Otherwise just do an equals
		} else {
			$this->update(array('unit_status'=>'Inactive'), 'unit_id = ?', array($unit_id));
		}
	}

	/**
	 * Retrieves records for units that have not been assigned a type for a property
	 *
	 * @param  int   $property_id ID of the property
	 * @param  int   $unittype_id Optional id for a unit type if you want to also include records assigned to one
	 * @return array              Array of unit records
	 */
	public function findUnitsWithoutType($property_id, $unittype_id=null) {
		$select = new Select();
		$select->from('unit')
				->whereOr()
				->whereNest()
				->whereEquals('property_id', '?')
				->whereIsNull('unittype_id')
				->order('unit_number');
		
		$params = array($property_id);

		if ($unittype_id !== null) {
			$select->whereUnnest()
					->whereEquals('unittype_id', '?');
			$params[] = $unittype_id;
		}

		return $this->adapter->query($select, $params);
	}
}

?>