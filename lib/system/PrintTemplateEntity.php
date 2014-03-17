<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 2/3/14
 * Time: 9:39 AM
 */

namespace NP\system;


class PrintTemplateEntity extends \NP\core\AbstractEntity {

	protected $fields = array(
		'Print_Template_Id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'Print_Template_Name'	 => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'print_template_label'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'Print_Template_Type'	 => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'Print_Template_LastUpdateDt'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'Print_Template_LastUpdateBy'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'Print_Template_Data'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2147483647)
			)
		),
		'isActive'	 => array()
	);

}