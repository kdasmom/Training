<?php
namespace NP\import;

/**
 * Entity class for PropertyGL
 *
 * @author Thomas Messier
 */
class PropertyGLImportEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'property_id_alt'     => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            )
        ),
		'glaccount_number'   => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            )
        ),
		'integration_package_name'	 => array(
			'required' => true,
			'validation' => array(
                'stringLength' => array('max'=>50)
            ),
			'tableConstraint' => array(
				'table'    => 'integrationpackage',
				'field'    => 'integration_package_name',
				'errorMsg' => 'importFieldIntegrationPackageNameError'
            )
		)
	);

}
?>