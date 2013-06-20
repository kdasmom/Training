<?php
namespace NP\property;

/**
 * Entity class for UnitTypeVal
 *
 * @author Thomas Messier
 */
class UnitTypeValEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'unittype_val_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'unittype_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'unittype_material_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'unittype_meas_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'unittype_val_val'	 => array(
			'required' => true)
	);

}
?>