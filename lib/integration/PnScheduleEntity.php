<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 3/3/14
 * Time: 12:21 PM
 */

namespace NP\integration;


class PnScheduleEntity extends \NP\core\AbstractEntity {

	protected $fields = array(
		'schedule_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'schedulecode'	 => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'schedulename'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>225)
			)
		),
		'integration_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'database'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'loadlimit'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'lastrun_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'seed_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'runeveryxminutes'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'isondemand'	 => array(
			'required' => true),
		'isactive'	 => array(
			'required' => true),
		'priority'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'universal_field1'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'universal_field2'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'universal_field3'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		)
	);

} 