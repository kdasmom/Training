<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 2/12/14
 * Time: 1:19 PM
 */

namespace NP\system;


class ClientEntity extends \NP\core\AbstractEntity {

	protected $fields = array(
		'client_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'client_name'	 => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>20)
			)
		),
		'client_acr'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'client_status'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'client_gl'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'client_template_dir'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'client_publish_dir'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'client_dev_datasource'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'client_hosting_datasource'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'poprint_header'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2147483647)
			)
		),
		'poprint_footer'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2147483647)
			)
		),
		'asp_client_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'poprint_additional_text'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2147483647)
			)
		),
		'client_version_id'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'logo_file'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2147483647)
			)
		)
	);

}