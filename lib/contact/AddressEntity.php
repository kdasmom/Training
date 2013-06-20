<?php
namespace NP\contact;

/**
 * Entity class for Address
 *
 * @author 
 */
class AddressEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'address_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'addresstype_id'	 => array(
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
		'address_attn'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'address_company'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'address_line1'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'address_line2'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'address_line3'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'address_city'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'address_state'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'address_zip'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'address_zipext'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>4)
			)
		),
		'address_country'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'address_id_alt'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		)
	);

}
?>