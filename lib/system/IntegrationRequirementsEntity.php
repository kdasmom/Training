<?php
namespace NP\system;

/**
 * Entity class for IntegrationRequirements
 *
 * @author 
 */
class IntegrationRequirementsEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'integration_requirements_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'integration_package_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'invoice_ref_max'	 => array(
			'required' => true,
			'defaultValue' => 25,
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_name_max'	 => array(
			'required' => true,
			'defaultValue' => 50,
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_new_DefaultGLCodeOnly'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'lineitem_description_max'	 => array(
			'required' => true,
			'defaultValue' => 50,
			'validation' => array(
				'digits' => array()
			)
		),
		'receipt_notes_max'	 => array(
			'defaultValue' => 255,
			'validation' => array(
				'digits' => array()
			)
		),
		'insurance_policynumber_max'	 => array(
			'defaultValue' => 12,
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_code_max'	 => array(
			'required' => true,
			'defaultValue' => 20,
			'validation' => array(
				'digits' => array()
			)
		),
		'custom_field7_maxlength'	 => array(
			'required' => true,
			'defaultValue' => 50,
			'validation' => array(
				'digits' => array()
			)
		),
		'custom_field8_maxlength'	 => array(
			'required' => true,
			'defaultValue' => 50,
			'validation' => array(
				'digits' => array()
			)
		),
		'receipt_customnotes_max'	 => array(
			'defaultValue' => 255,
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_city_max'	 => array(
			'defaultValue' => 25,
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'custom_field7_lineitem_maxlength'	 => array(
			'required' => true,
			'defaultValue' => 50,
			'validation' => array(
				'digits' => array()
			)
		),
		'custom_field8_lineitem_maxlength'	 => array(
			'required' => true,
			'defaultValue' => 50,
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_address1_max'	 => array(
			'defaultValue' => 50,
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>