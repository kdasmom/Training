<?php
namespace NP\user;

/**
 * Entity class for Userprofilerole
 *
 * @author 
 */
class UserprofileroleEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'userprofilerole_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'role_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'tablekey_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofilerole_status'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		)
	);

}
?>