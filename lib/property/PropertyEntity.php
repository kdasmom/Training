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
			'validation' => array(
				'numeric' => array(),
				'inArray' => array(
					'haystack' => array(-1,0,1)
				)
			)
		),
		'property_download'	 => array(),
		'region_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'integration_package_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'sync'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'fiscaldisplaytype_value'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'cash_accural'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'UserProfile_ID'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'createdatetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'property_optionBillAddress'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'property_optionShipAddress'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'default_billto_property_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'default_shipto_property_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'property_volume'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>15)
			)
		),
		'last_updated_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'last_updated_by'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'property_NexusServices'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'property_VendorCatalog'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>