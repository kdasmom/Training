<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 10/15/13
 * Time: 4:35 AM
 */

namespace NP\vendor;


class InsuranceTypeEntity extends \NP\core\AbstractEntity {

	protected $fields = array(
		'insurancetype_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'insurancetype_name'	 => array(
			'required' => true,
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
			'validation' => array(
				'digits' => array()
			)
		)
	);

}