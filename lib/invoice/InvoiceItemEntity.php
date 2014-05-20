<?php
namespace NP\invoice;

/**
 * Entity class for InvoiceItem
 *
 * @author Thomas Messier
 */
class InvoiceItemEntity extends \NP\core\AbstractEntity {
	protected $auditable = true;

	protected $fields = array(
		'invoiceitem_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoice_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'invoiceitem_linenum'	 => array(
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
		'invoiceitem_description'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1000)
			),
			'auditable' => [
				'displayName'  => 'Item Description'
			]
		),
		'invoiceitem_quantity'	 => array(
			'validation' => array(
				'numeric' => array()
			),
			'auditable' => [
				'displayName'  => 'Item Quantity'
			]
		),
		'invoiceitem_unitprice'	 => array(
			'validation' => array(
				'numeric' => array()
			),
			'auditable' => [
				'displayName'  => 'Item Unit Price'
			]
		),
		'invoiceitem_amount'	 => array(
			'validation' => array(
				'numeric' => array()
			),
			'auditable' => [
				'displayName'  => 'Item Amount'
			]
		),
		'invoiceitem_budgetvariance'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'invoiceitem_created'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'invoiceitem_salestax'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'invoiceitem_shipping'	 => array(
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
		'invoiceitem_taxflag'	 => array(
			'defaultValue' => 'N',
			'validation' => array(
				'stringLength' => array('max'=>1)
			),
			'auditable' => [
				'displayName'  => 'Tax Flag'
			]
		),
		'invoiceitem_description_alt'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1000)
			)
		),
		'invoiceitem_split'	 => array(
			'defaultValue' => 0,
			'validation' => array(
				'digits' => array()
			)
		),
		'invoiceitem_period'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'utilityaccount_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'utilitycolumn_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'utilitycolumn_usagetype_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'vendorsite_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'invoiceitem_jobflag'	 => array(),
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
		'dfsplit_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'vcitem_number'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			),
			'auditable' => [
				'displayName' => 'Item Number'
			]
		),
		'vcitem_uom'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			),
			'auditable' => [
				'displayName' => 'Unit of Measurement'
			]
		),
		'is_from_catalog'	 => array(
			'defaultValue' => 0
		),
		'unittype_material_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'unittype_meas_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'reftable_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>12)
			)
		),
		'reftablekey_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array(
				'table'    => 'poitem',
				'field'    => 'poitem_id'
            )
		),
		'invoiceitem_quantity_long'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'invoiceitem_unitprice_long'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		)
	);

}
?>