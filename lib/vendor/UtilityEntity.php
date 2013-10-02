<?php
namespace NP\vendor;

/**
 * Entity class for Utility
 *
 * @author Thomas Messier
 */
class UtilityEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'Utility_Id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'UtilityType_Id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array(
				'table' => 'utilitytype',
				'field' => 'utilitytype_id'
			)
		),
		'Property_Id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'Vendorsite_Id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array(
				'table' => 'vendorsite',
				'field' => 'vendorsite_id'
			)
		),
		'periodic_billing_flag'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'period_billing_cycle'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>