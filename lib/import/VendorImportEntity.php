<?php
namespace NP\import;

/**
 * Entity class for Vendor Import
 *
 * @author 
 */
class VendorImportEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'vendor_id_alt'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vendor_name'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>500)
			)
		),
		'vendor_fedid'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>30)
			)
		),
		'vendor_tax_reporting_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>80)
			)
		),
		'vendor_status'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vendortype_code'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>30)
			)
		),
		'vendor_paypriority'	 => array(
			'required'   => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_createddatetm'	 => array(
			'required'   => true,
			'validation' => array(
				'date' => array('format'=>'m/d/Y')
			)
		),
		'vendor_lastupdate_date'	 => array(
			'required'   => true,
			'validation' => array(
				'date' => array('format'=>'m/d/Y')
			)
		),
		'vendor_type1099'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>5),
	            'inArray'      => array(
	                'haystack' => array('True','False','true','false','TRUE','FALSE')
	            )
			)
		),
		'vendor_termsdatebasis'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'paydatebasis_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'default_glaccount_number'	 => array(
			'validation' => array(
                'stringLength' => array('max'=>50)
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
        'person_firstname'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'person_lastname'	 => array(
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
				'table' => 'integrationpackage',
				'field' => 'integration_package_name'
			)
		)
	);

}
