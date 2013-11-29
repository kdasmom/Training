<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 11/29/13
 * Time: 1:20 PM
 */

namespace NP;


class LinkVcVcCat extends \NP\core\AbstractEntity {

	protected $fields = array(
		'link_vc_vccat_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vc_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'vccat_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		)
	);

}