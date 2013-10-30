<?php
namespace NP\property;

/**
 * Entity class for Unit
 *
 * @author Thomas Messier
 */
class UnitEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'unit_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'unit_id_alt'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'building_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'unittype_id'	 => array(
			'required'   => true,
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'unit_number'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'unit_status'	 => array(
			'required'   => true,
			'defaultValue' => 'active',
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'unit_dateavail'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'unit_squarefeet'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'property_id'	 => array(
			'required'   => true,
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		)
	);

}
?>