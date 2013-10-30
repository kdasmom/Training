<?php
namespace NP\import;

/**
 * Entity class for Budget/Actuals
 *
 * @author Thomas Messier
 */
class GLBudgetImportEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'property_id_alt'	 => array(
			'required' => true
		),
		'glaccount_number'	 => array(
			'required' => true
		),
		'period_month'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'glaccountyear_year'	 => array(
            'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'amount' => array(
			'required' => true,
			'validation' => array(
				'numeric' => array()
			)
		),
		'integration_package_name'	 => array(
			'required' => true
		)
	);

}
?>