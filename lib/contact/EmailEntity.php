<?php
namespace NP\contact;

/**
 * Entity class for Email
 *
 * @author 
 */
class EmailEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'email_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'emailtype_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'tablekey_id'	 => array(
			'required'   => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'table_name'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'email_address'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		)
	);

}
?>