<?php

namespace NP\property;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the UNITTYPE_MEAS table
 *
 * @author 
 */
class UnitTypeMeasGateway extends AbstractGateway {
	protected $table = 'unittype_meas';

	/**
	 * Returns all combinations of materials and measurements
	 *
	 * @return array
	 */
	public function findAllMeasAndMaterials() {
		$select = new Select();
		$select->from(array('um'=>'unittype_meas'))
				->join(array('uma'=>'unittype_material'),
						null,
						array('unittype_material_id','unittype_material_name'),
						Select::JOIN_CROSS);

		return $this->adapter->query($select);
	}


	/**
	 * return property meas
	 *
	 * @param $property_id
	 * @return array|bool
	 */
	public function findMeasByPropertyId($property_id) {
		$select = new Select();

		$select->from(['um' => 'unittype_meas'])
				->columns(['unittype_meas_id', 'unittype_meas_name'])
				->join(['uma' => 'unittype_material'], '1=1', ['unittype_material_id', 'unittype_material_name'], Select::JOIN_LEFT)
				->join(['uv' => 'unittype_val'], 'um.unittype_meas_id = uv.unittype_meas_id AND uma.unittype_material_id = uv.unittype_material_id', ['unittype_id', 'unittype_val_id', 'unittype_val_val'], Select::JOIN_LEFT)
				->join(['u' => 'unittype'], 'uv.unittype_id = u.unittype_id', ['unittype_name'])
				->where(['u.property_id' => '?']);

		return $this->adapter->query($select, [$property_id]);
	}
}

?>