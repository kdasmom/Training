<?php
namespace NP\user;

/**
 * Entity class for Delegation
 *
 * @author Thomas Messier
 */
class DelegationEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'Delegation_Id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'UserProfile_Id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'Delegation_To_UserProfile_Id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'Delegation_StartDate'	 => array(),
		'Delegation_StopDate'	 => array(),
		'Delegation_Status'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'Delegation_CreatedDate'	 => array(),
		'delegation_createdby'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>