<?php
namespace NP\property;

/**
 * Entity class for Property
 *
 * @author 
 */
class PropertyEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'property_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'property_id_alt'	 => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'property_id_alt_ap'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'property_department_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'company_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'property_name'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'property_salestax'	 => array(),
		'property_no_units'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'property_fiscal_year'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'property_account_month'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'property_closing_day'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'property_account_method'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'second_property_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'second_company_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'company_id_alt'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'fixedasset_account'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'matching_threshold'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'property_status'	 => array(
			'required'   => true,
			'defaultValue' => -1,
			'validation' => array(
				'numeric' => array(),
				'inArray' => array(
					'haystack' => array(-1,0,1)
				)
			)
		),
		'property_download'	 => array(
			'defaultValue' => 1
		),
		'region_id'	 => array(
			'required'   => true,
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'integration_package_id'	 => array(
			'required'   => true,
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array(
				'table' => 'integrationpackage',
				'field' => 'integration_package_id'
			)
		),
		'sync'	 => array(
			'defaultValue' => 0,
			'validation' => array(
				'digits' => array()
			)
		),
		'fiscaldisplaytype_value'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array(
				'table' => 'fiscaldisplaytype',
				'field' => 'fiscaldisplaytype_id'
			)
		),
		'cash_accural'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>10),
				'inArray' => array(
                    'haystack' => array('Cash','Accural','cash','accural','CASH','ACCURAL')
                )
			)
		),
		'UserProfile_ID'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'createdatetm'	 => array(
			'timestamp' => 'created',
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'property_optionBillAddress'	 => array(
			'validation' => array(
				'digits' => array(),
				'inArray' => array(
                    'haystack' => array(1,0)
                )
			)
		),
		'property_optionShipAddress'	 => array(
			'validation' => array(
				'digits' => array(),
				'inArray' => array(
                    'haystack' => array(1,0)
                )
			)
		),
		'default_billto_property_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array(
				'table' => 'property',
				'field' => 'property_id'
			)
		),
		'default_shipto_property_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array(
				'table' => 'property',
				'field' => 'property_id'
			)
		),
		'property_volume'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>15)
			)
		),
		'last_updated_datetm'	 => array(
			'timestamp' => 'updated',
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'last_updated_by'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array(
				'table' => 'userprofile',
				'field' => 'userprofile_id'
			)
		),
		'property_NexusServices'	 => array(
			'defaultValue' => 1,
			'validation' => array(
				'digits' => array()
			)
		),
		'property_VendorCatalog'	 => array(
			'defaultValue' => 1,
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>