<?php
namespace NP\user;

/**
 * Entity class for Delegation
 *
 * @author Thomas Messier
 */
class DelegationEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'delegation_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'delegation_to_userprofile_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'delegation_startdate'	 => array(),
		'delegation_stopdate'	 => array(),
		'delegation_status'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'delegation_createddate'	 => array(),
		'delegation_createdby'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>