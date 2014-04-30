<?php
namespace NP\po;

/**
 * Entity class for PurchaseOrder
 *
 * @author Thomas Messier
 */
class PurchaseOrderEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'purchaseorder_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'sent_vendor_portal_flag'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'purchaseorder_quote'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'purchaseorder_quoteamount'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'vendorsite_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'purchaseorder_status'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'purchaseorder_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'purchaseorder_created'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'property_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'purchaseorder_note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			)
		),
		'purchaseorder_closeddatetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'project_id'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'task_id'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'purchaseorder_reject_note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			)
		),
		'purchaseorder_period'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'purchaseorder_multiproperty'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'purchaseorder_taxallflag'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'purchaseorder_ref'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'purchaseorder_budgetoverage_note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			)
		),
		'lock_id'	 => array(
			'validation' => array(
				'digits' => array()
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
		'PriorityFlag_ID_Alt'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'purchaseorder_NeededBy_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'Purchaseorder_billaddress'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>500)
			)
		),
		'Purchaseorder_shipaddress'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>500)
			)
		),
		'Purchaseorder_bill_propertyID'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'Purchaseorder_ship_propertyID'	 => array(
			'validation' => array(
				'digits' => array()
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
		'purchaseorder_rct_req'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'purchaseorder_rct_canReceive'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'sysdatetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'purchaseorder_rct_canReceive_userprofileID'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'purchaseorder_rct_canReceive_dt'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'address_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'print_template_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>