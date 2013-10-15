<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 10/15/13
 * Time: 10:02 AM
 */

namespace NP\vendor;


class InsuranceEntity extends \NP\core\AbstractEntity {

	protected $fields = array(
		'insurance_id'	 => array(
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
				'stringLength' => array('max'=>50)
			)
		),
		'insurancetype_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'insurance_company'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>250)
			)
		),
		'insurance_policynum'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>250)
			)
		),
		'insurance_expdatetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'insurance_status'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'insurance_policy_effective_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'insurance_policy_limit'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'insurance_additional_insured_listed'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		)
	);

}