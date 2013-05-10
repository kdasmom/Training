<?php
namespace NP\notification;

/**
 * Entity class for EmailAlert
 *
 * @author 
 */
class EmailAlertEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'emailalert_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'emailalert_type'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'emailalert_days_pending'	 => array(
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