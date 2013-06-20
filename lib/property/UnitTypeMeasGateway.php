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
}

?>