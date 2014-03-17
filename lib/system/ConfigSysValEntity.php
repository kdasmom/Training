<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 1/17/14
 * Time: 4:24 PM
 */

namespace NP\system;


class ConfigSysValEntity extends \NP\core\AbstractEntity {

	protected $fields = array(
		'configsysval_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'configsys_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'configsysclient_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'configsysval_val'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'configsysval_load'	 => array(
			'required' => true),
		'configsysval_show'	 => array(
			'required' => true),
		'configsysval_active'	 => array(
			'required' => true),
		'configsysval_created_datetm'	 => array(
			'required' => true,
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'configsysval_created_by'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'configsysval_updated_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'configsysval_updated_by'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}