<?php
namespace NP\import;

/**
 * Entity class for Unit import
 *
 * @author Thomas Messier
 */
class UnitImportEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
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
		),
		'property_id_alt'     => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            )
        ),
		'unit_id_alt'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'unit_number'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'unittype_name'	 => array(
            'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'tableConstraint' => array(
				'table'    => 'unittype',
				'field'    => 'unittype_name'
            )
		)
	);

}
?>