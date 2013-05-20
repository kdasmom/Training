<?php
namespace NP\user;

/**
 * Entity class for DelegationProp
 *
 * @author 
 */
class DelegationPropEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'delegationprop_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'delegation_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'property_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>