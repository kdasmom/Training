<?php
namespace NP\import;

/**
 * Entity class for Unit Type import
 *
 * @author Thomas Messier
 */
class UnitTypeImportEntity extends \NP\core\AbstractEntity {
	
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
		'unittype_name'	 => array(
            'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>5)
			)
		),
		'unittype_bedrooms'	 => array(
            'required'   => true,
			'validation' => array(
				'numeric' => array()
			)
		),
		'unittype_bathrooms' => array(
            'required'   => true,
			'validation' => array(
				'numeric' => array()
			)
		),
		'carpet_yards' => array(
            'required'   => true,
			'validation' => array(
				'numeric' => array()
			)
		),
		'vinyl_yards' => array(
            'required'   => true,
			'validation' => array(
				'numeric' => array()
			)
		),
		'tile_yards' => array(
            'required'   => true,
			'validation' => array(
				'numeric' => array()
			)
		),
		'hardwood_yards' => array(
            'required'   => true,
			'validation' => array(
				'numeric' => array()
			)
		),
		'carpet_feet' => array(
            'required'   => true,
			'validation' => array(
				'numeric' => array()
			)
		),
		'vinyl_feet' => array(
            'required'   => true,
			'validation' => array(
				'numeric' => array()
			)
		),
		'tile_feet' => array(
            'required'   => true,
			'validation' => array(
				'numeric' => array()
			)
		),
		'hardwood_feet' => array(
            'required'   => true,
			'validation' => array(
				'numeric' => array()
			)
		)

	);

}
?>