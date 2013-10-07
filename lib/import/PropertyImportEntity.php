<?php
namespace NP\import;

/**
 * Entity class for importing properties
 *
 * @author Thomas Messier
 */
class PropertyImportEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'property_id_alt'     => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            )
        ),
        'property_name'   => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            )
        ),
        'address_attn'   => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>255)
            )
        ),
        'address_line1'   => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>255)
            )
        ),
		'address_line2'	 => array(
			'validation' => array(
                'stringLength' => array('max'=>255)
            )
		),
        'address_city'  => array(
            'required' => true,
            'validation' => array(
                'stringLength' => array('max'=>100)
            )
        ),
        'address_state'  => array(
            'required' => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            )
        ),
        'address_zip'  => array(
            'required' => true,
            'validation' => array(
                'stringLength' => array('max'=>10)
            )
        ),
        'phone_number'  => array(
            'required' => true,
            'validation' => array(
                'stringLength' => array('max'=>14)
            )
        ),
        'fax_number'  => array(
            'validation' => array(
                'stringLength' => array('max'=>14)
            )
        ),
        'property_salestax'  => array(
            'defaultValue' => 0,
            'validation' => array(
                'numeric' => array()
            )
        ),
        'property_no_units'  => array(
            'required' => true,
            'validation' => array(
                'digits'       => array(),
                'stringLength' => array('max'=>50)
            )
        ),
        'region_name'  => array(
            'required' => true,
            'validation' => array(
                'stringLength' => array('max'=>250)
            ),
            'tableConstraint' => array(
                'table' => 'region',
                'field' => 'region_name'
            )
        ),
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
        'property_optionBillAddress'  => array(
            'required' => true,
            'validation' => array(
                'stringLength' => array('max'=>3),
                'inArray'      => array(
                    'haystack' => array('Yes','No','yes','no','YES','NO')
                )
            )
        ),
        'default_billto_property_id_alt'  => array(
            'validation' => array(
                'stringLength' => array('max'=>50)
            ),
            'tableConstraint' => array(
                'table' => 'property',
                'field' => 'property_id_alt'
            )
        ),
        'property_optionShipAddress'  => array(
            'required' => true,
            'validation' => array(
                'stringLength' => array('max'=>3),
                'inArray'      => array(
                    'haystack' => array('Yes','No','yes','no','YES','NO')
                )
            )
        ),
        'default_shipto_property_id_alt'  => array(
            'validation' => array(
                'stringLength' => array('max'=>50)
            ),
            'tableConstraint' => array(
                'table' => 'property',
                'field' => 'property_id_alt'
            )
        ),
        'cash_accural'  => array(
            'required' => true,
            'validation' => array(
                'inArray' => array(
                    'haystack' => array('Cash','Accural','cash','accural','CASH','ACCURAL')
                )
            )
        ),
        'fiscalcal_name'  => array(
            'required' => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            ),
            'tableConstraint' => array(
                'table' => 'fiscalcal',
                'field' => 'fiscalcal_name'
            )
        ),
        'fiscaldisplaytype_name'  => array(
            'required' => true,
            'validation' => array(
                'stringLength' => array('max'=>64)
            ),
            'tableConstraint' => array(
                'table' => 'fiscaldisplaytype',
                'field' => 'fiscaldisplaytype_name'
            )
        ),
        'matching_threshold'  => array(
            'required' => true,
            'validation' => array(
                'numeric' => array()
            )
        ),
        'customfielddata_value1'  => array(
            'validation' => array(
                'stringLength' => array('max'=>255)
            )
        ),
        'customfielddata_value2'  => array(
            'validation' => array(
                'stringLength' => array('max'=>255)
            )
        ),
        'customfielddata_value3'  => array(
            'validation' => array(
                'stringLength' => array('max'=>255)
            )
        ),
        'customfielddata_value4'  => array(
            'validation' => array(
                'stringLength' => array('max'=>255)
            )
        )
	);

}
?>