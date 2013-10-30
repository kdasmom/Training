<?php
namespace NP\import;

/**
 * Entity class for importing GL categories
 *
 * @author Thomas Messier
 */
class GLCategoryImportEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'glaccount_name'	 => array(
			'required' => true
		),
		'integration_package_name'	 => array(
			'required' => true,
			'tableConstraint' => array(
				'table'    => 'integrationpackage',
				'field'    => 'integration_package_name',
				'errorMsg' => 'importFieldIntegrationPackageNameError'
            ),
		)
	);

}
?>