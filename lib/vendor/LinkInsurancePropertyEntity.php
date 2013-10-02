<?php
namespace NP\vendor;

/**
 * Entity class for LinkInsuranceProperty
 *
 * @author Thomas Messier
 */
class LinkInsurancePropertyEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'link_insurance_property_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'insurance_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'property_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'createdatetm'	 => array(
			'timestamp' => 'created',
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		)
	);

}
?>