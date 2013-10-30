<?php
namespace NP\user;

/**
 * Entity class for UserPropertyEntity
 *
 * @author Aliaksandr Zubik
 */
class UserPropertyEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'propuser_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'property_id'	 => array(
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