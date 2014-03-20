<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 1/17/14
 * Time: 1:42 PM
 */

namespace NP\system;


class ConfigSysLkpVal extends \NP\core\AbstractEntity {

	protected $fields = array(
		'configsyslkpval_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'configsyslkp_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'configsyslkpval_name'	 => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'configsyslkpval_val'	 => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'configsyslkpval_order'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		)
	);

}