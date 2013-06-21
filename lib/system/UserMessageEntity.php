<?php
namespace NP\system;

/**
 * Entity class for UserMessage
 *
 * @author Thomas Messier
 */
class UserMessageEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'type'	 => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'status'	 => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'subject'	 => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'body'	 => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>6000)
			)
		),
		'createdBy'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'createdAt'	 => array(
			'required' => true,
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'sentAt'	 => array(
			'required' => true,
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'displayUntil'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		)
	);

}
?>