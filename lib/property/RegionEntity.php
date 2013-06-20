<?php
namespace NP\property;

/**
 * Entity class for Region
 *
 * @author Thomas Messier
 */
class RegionEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'region_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'region_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>250)
			)
		),
		'asp_client_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'universal_field_status'	 => array(
			'required'     => true,
			'defaultValue' => 1,
			'validation'   => array(
				'digits' => array()
			)
		)
	);

}
?>