<?php
namespace NP\contact;

/**
 * Entity class for Person
 *
 * @author 
 */
class PersonEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'person_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'asp_client_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'person_title'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>20)
			)
		),
		'person_firstname'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'person_middlename'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'person_lastname'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'person_suffix'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>20)
			)
		),
		'person_ssn'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>11)
			)
		),
		'person_gender'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'person_birthdate'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'personmarital_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'person_passport_no'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		)
	);

}
?>