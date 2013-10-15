<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 10/14/13
 * Time: 5:48 PM
 */

namespace NP\contact;


class ContactEntity extends \NP\core\AbstractEntity {

	protected $fields = array(
		'contact_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'contact_id_alt'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>15)
			)
		),
		'contact_lastupdate_date'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'contacttype_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'table_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'tablekey_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'person_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'contact_relation'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'table_status'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		)
	);

}