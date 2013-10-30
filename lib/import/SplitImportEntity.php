<?php
namespace NP\import;

/**
 * Entity class for importing splits
 *
 * @author Thomas Messier
 */
class SplitImportEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'integration_package_name'  => array(
            'required' => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            ),
            'tableConstraint' => array(
                'table' => 'integrationpackage',
                'field' => 'integration_package_name'
            )
        ),
		'dfsplit_name'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>200)
			)
		),
		'vendor_id_alt'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'property_id_alt'	 => array(
            'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'glaccount_number'   => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            ),
			'tableConstraint' => array(
				'table' => 'glaccount',
				'field' => 'glaccount_number'
			)
        ),
		'unit_id_alt'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'universal_field1'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'universal_field2'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'universal_field3'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'universal_field4'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'universal_field5'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'universal_field6'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'dfsplititem_percent'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		)
	);

}
?>