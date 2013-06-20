<?php
namespace NP\contact;

/**
 * Entity class for Phone
 *
 * @author 
 */
class PhoneEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'phone_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'phonetype_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'tablekey_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'table_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'phone_number'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'phone_ext'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'phone_countrycode'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		)
	);

}
?>