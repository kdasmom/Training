<?php
namespace NP\vendor;

/**
 * Entity class for UtilityAccount
 *
 * @author Thomas Messier
 */
class UtilityAccountEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'UtilityAccount_Id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'Utility_Id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array(
				'table' => 'utility',
				'field' => 'utility_id'
			)
		),
		'UtilityAccount_Units'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'UtilityAccount_Bedrooms'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'UtilityAccount_MeterSize'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>64)
			)
		),
		'UtilityAccount_AccountNumber'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>64)
			)
		),
		'property_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array(
				'table' => 'property',
				'field' => 'property_id'
			)
		),
		'utilityaccount_Building'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'utilityaccount_active'	 => array(
			'required'     => true,
			'defaultValue' => 1
		),
		'glaccount_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'unit_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		)
	);

}
?>