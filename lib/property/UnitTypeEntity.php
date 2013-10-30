<?php
namespace NP\property;

/**
 * Entity class for UnitType
 *
 * @author Thomas Messier
 */
class UnitTypeEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'unittype_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'unittype_id_alt'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>5)
			)
		),
		'unittype_name'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'unittype_order'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'unittype_bedrooms'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'unittype_bathrooms' => array(
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
		),
		'unittype_updated_by'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array(
				'table' => 'userprofile',
				'field' => 'userprofile_id'
			)
		),
		'unittype_updated_date'	 => array(
			'timestamp'  => 'updated',
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		)
	);

}
?>