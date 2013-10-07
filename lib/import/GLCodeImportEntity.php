<?php
namespace NP\import;

/**
 * Entity class for importing GL codes
 *
 * @author Thomas Messier
 */
class GLCodeImportEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'glaccount_name'     => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>255)
            )
        ),
        'glaccount_number'   => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            )
        ),
        'glaccounttype_name'   => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            ),
			'tableConstraint' => array(
				'table'    => 'glaccounttype',
				'field'    => 'glaccounttype_name',
				'errorMsg' => 'importFieldGlAccounTypeError'
            )
        ),
        'category_name'   => array(
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