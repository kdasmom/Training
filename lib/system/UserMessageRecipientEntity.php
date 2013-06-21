<?php
namespace NP\system;

/**
 * Entity class for UserMessageRecipient
 *
 * @author Thomas Messier
 */
class UserMessageRecipientEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'UserMessage_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'role_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>