<?php
namespace NP\gl\validation;

use NP\core\validation\AbstractValidator;

/**
 * A class to validate gl account line item data sets
 *
 * See NP\core\validation\AbstractValidator.
 * 
 * @author Aliaksandr Zubik
 */
class GLAccountItemValidator extends AbstractValidator {
	
	protected $rules = array(
		'glaccount_name'			=> array(),
		'glaccount_number'			=> array(
			'required' => true,
			'validation' => array(
				array(
					'int' => array(),
					'greaterThan' =>array(
						'min'       => 0
					)
				)
			)
		),
		'glaccounttype_id' => array(),
		'glaccount_level' => array(),
		'integration_package_id' => array()
	);
}

?>