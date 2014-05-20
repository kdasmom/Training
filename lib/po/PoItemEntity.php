<?php
namespace NP\po;

/**
 * Entity class for PoItem
 *
 * @author Thomas Messier
 */
class PoItemEntity extends \NP\core\AbstractEntity implements \NP\workflow\WorkflowableInterface {
	protected $auditable = true;

	protected $fields = array(
		'poitem_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'glaccount_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'auditable' => [
				'table'        => 'glAccount',
				'displayField' => 'glaccount_name',
				'displayName'  => 'GL Account'
			],
			'tableConstraint' => array()
		),
		'poitem_description'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1000)
			),
			'auditable' => [
				'displayName'  => 'Item Description'
			]
		),
		'poitem_quantity'	 => array(
			'validation' => array(
				'numeric' => array()
			),
			'auditable' => [
				'displayName'  => 'Item Quantity'
			]
		),
		'poitem_unitprice'	 => array(
			'validation' => array(
				'numeric' => array()
			),
			'auditable' => [
				'displayName'  => 'Item Unit Price'
			]
		),
		'poitem_amount'	 => array(
			'validation' => array(
				'numeric' => array()
			),
			'auditable' => [
				'displayName'  => 'Item Amount'
			]
		),
		'purchaseorder_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
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
			),
			'auditable' => [
				'table'        => 'property',
				'displayField' => 'property_name',
				'displayName'  => 'Item Property'
			],
			'tableConstraint' => array()
		),
		'unit_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'auditable' => [
				'table'        => 'unit',
				'displayField' => 'unit_number',
				'displayName'  => 'Unit'
			],
			'tableConstraint' => array()
		),
		'poitem_taxflag'	 => array(
			'defaultValue' => 'N',
			'validation' => array(
				'stringLength' => array('max'=>1)
			),
			'auditable' => [
				'displayName'  => 'Tax Flag'
			]
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
			),
			'auditable' => [
				'displayNameSetting' => 'CP.CUSTOM_FIELD_LABEL1_LINEITEM'
			]
		),
		'universal_field2'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => [
				'displayNameSetting' => 'CP.CUSTOM_FIELD_LABEL2_LINEITEM'
			]
		),
		'universal_field3'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => [
				'displayNameSetting' => 'CP.CUSTOM_FIELD_LABEL3_LINEITEM'
			]
		),
		'universal_field4'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => [
				'displayNameSetting' => 'CP.CUSTOM_FIELD_LABEL4_LINEITEM'
			]
		),
		'universal_field5'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => [
				'displayNameSetting' => 'CP.CUSTOM_FIELD_LABEL5_LINEITEM'
			]
		),
		'universal_field6'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => [
				'displayNameSetting' => 'CP.CUSTOM_FIELD_LABEL6_LINEITEM'
			]
		),
		'universal_field7'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => [
				'displayNameSetting' => 'CP.CUSTOM_FIELD_LABEL7_LINEITEM'
			]
		),
		'universal_field8'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => [
				'displayNameSetting' => 'CP.CUSTOM_FIELD_LABEL8_LINEITEM'
			]
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

	public function getPropertyId() {
		return $this->property_id;
	}

	public function getAmount() {
		return $this->poitem_amount + $this->poitem_shipping + $this->poitem_salestax;
	}

}
?>