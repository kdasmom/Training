<?php
namespace NP\user;

/**
 * Entity class for Staff
 *
 * @author Thomas Messier
 */
class StaffEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'staff_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'staff_id_alt'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>15)
			)
		),
		'person_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'staff_status'	 => array(
			'defaultValue' => 'active',
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		)
	);

}
?>