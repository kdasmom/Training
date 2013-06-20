<?php
namespace NP\system;

/**
 * Entity class for IntegrationPackage
 *
 * @author Thomas Messier
 */
class IntegrationPackageEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'integration_package_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'integration_package_datasource'	 => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'integration_package_name'	 => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'asp_client_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'integration_package_type_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'is_standalone'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'Integration_Package_ManualTransfer'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'universal_field_status'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>