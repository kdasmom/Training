<?php
namespace NP\vendor;

/**
 * Entity class for UtilityType
 *
 * @author Thomas Messier
 */
class UtilityTypeEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'UtilityType_Id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'UtilityType'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'asp_client_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'universal_field_status'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>