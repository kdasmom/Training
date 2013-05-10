<?php
namespace NP\notification;

/**
 * Entity class for EmailAlertHour
 *
 * @author 
 */
class EmailAlertHourEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'emailalerthour_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'runhour'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'role_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'isActive'	 => array(
			'required'     => true,
			'defaultValue' => 1
		)
	);

}
?>