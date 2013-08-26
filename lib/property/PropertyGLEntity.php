<?php
namespace NP\property;

/**
 * Entity class for PropertyGL
 *
 * @author 
 */
class PropertyGLEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'propertyglaccount_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'property_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'glaccount_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>