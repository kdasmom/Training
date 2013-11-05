<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 11/5/13
 * Time: 10:48 AM
 */

namespace NP\system;


class MessageEntity extends \NP\core\AbstractEntity {

	protected $fields = array(
		'message_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'messagetype_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'table_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'tablekey_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'message_text'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1000)
			)
		),
		'message_flagstatus'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'message_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'message_userprofile_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}