<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 1/24/14
 * Time: 4:23 AM
 */

namespace NP\system;


class PnUniversalFieldEntity extends \NP\core\AbstractEntity {

	protected $fields = array(
		'universal_field_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'universal_field_data'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'universal_field_number'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'universal_field_status'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'universal_field_order'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'islineitem'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'isrelatedto'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'customfield_pn_type'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		)
	);

}