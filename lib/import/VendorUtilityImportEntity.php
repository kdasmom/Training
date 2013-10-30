<?php
namespace NP\import;

/**
 * Entity class for importing utilities
 *
 * @author Thomas Messier
 */
class VendorUtilityImportEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'vendor_id_alt'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			),
			'tableConstraint' => array(
				'table' => 'vendor',
				'field' => 'vendor_id_alt'
			)
		),
		'UtilityType'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			),
			'tableConstraint' => array(
				'table' => 'utilitytype',
				'field' => 'UtilityType'
			)
		),
		'UtilityAccount_AccountNumber'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>64)
			)
		),
		'property_id_alt'	 => array(
            'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			),
			'tableConstraint' => array(
				'table' => 'property',
				'field' => 'property_id_alt'
			)
		),
		'unit_id_alt'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'UtilityAccount_MeterSize'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>64)
			)
		),
		'glaccount_number'   => array(
            'validation' => array(
                'stringLength' => array('max'=>50)
            ),
			'tableConstraint' => array(
				'table' => 'glaccount',
				'field' => 'glaccount_number'
			)
        )
	);

}
?>