<?php
namespace NP\po;

/**
 * Entity class for PoItem
 *
 * @author Thomas Messier
 */
class PoItemEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'poitem_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'glaccount_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'poitem_description'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1000)
			)
		),
		'poitem_quantity'	 => array(),
		'poitem_unitprice'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'poitem_amount'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'purchaseorder_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'poitem_budgetvariance'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'poitem_created'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'poitem_salestax'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'poitem_shipping'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'property_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'unit_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'poitem_taxflag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'poitem_description_alt'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1000)
			)
		),
		'reftable_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'reftablekey_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'poitem_split'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'poitem_period'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'poitem_linenum'	 => array(),
		'poitem_jobflag'	 => array(),
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
		'poitem_isReceived'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'poitem_cancel_userprofile_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'poitem_cancel_dt'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'parent_poitem_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'sysdatetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'dfsplit_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vcitem_number'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'vcitem_uom'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'universal_field7'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'universal_field8'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'is_from_catalog'	 => array(),
		'unittype_material_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'unittype_meas_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vcorder_aux_part_id'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		)
	);

}
?>