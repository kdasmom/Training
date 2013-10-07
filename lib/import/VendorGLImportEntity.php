<?php
namespace NP\import;

/**
 * Entity class for Vendor GL import
 *
 * @author Thomas Messier
 */
class VendorGLImportEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'vendor_id_alt'     => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            )
        ),
		'glaccount_number'	 => array(
            'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'integration_package_name'	 => array(
			'required'   => true,
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