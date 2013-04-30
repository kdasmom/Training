<?php
namespace NP\catalog;

/**
 * Entity class for VcItem
 *
 * @author 
 */
class VcItemEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'vcitem_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'vc_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vcitem_status'	 => array(),
		'UNSPSC_Commodity_Commodity'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vcitem_category_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'vcitem_type'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'vcitem_number'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'vcitem_price'	 => array(),
		'vcitem_desc'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>250)
			)
		),
		'vcitem_uom'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vcitem_pkg_qty'	 => array(),
		'vcitem_case_qty'	 => array(),
		'vcitem_desc_ext'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			)
		),
		'vcitem_min_qty'	 => array(),
		'vcitem_manufacturer'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vcitem_color'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vcitem_upc'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>150)
			)
		),
		'vcitem_mft_partnumber'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vcitem_imageurl'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>500)
			)
		),
		'vcitem_infourl'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>500)
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
		'vcitem_weight'	 => array()
	);

}
?>