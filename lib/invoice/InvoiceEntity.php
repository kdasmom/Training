<?php
namespace NP\invoice;

/**
 * Entity class for Invoice
 *
 * @author Thomas Messier
 */
class InvoiceEntity extends \NP\core\AbstractEntity {
	protected $auditable = true;

	public $fields = array(
		'invoice_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'reftable_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'invoice_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			),
			'auditable' => [
				'displayName'  => 'Invoice Date'
			]
		),
		'invoice_createddatetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'invoice_status'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'invoice_budgetid'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoice_glaccountid'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'paytable_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'paytablekey_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'auditable' => [
				'displayName'  => 'Vendor'
			]
		),
		'property_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'auditable' => [
				'table'        => 'property',
				'displayField' => 'property_name',
				'displayName'  => 'Property'
			]
		),
		'invoice_ref'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			),
			'auditable' => [
				'displayName'  => 'Invoice Number'
			]
		),
		'invoice_note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			),
			'auditable' => [
				'displayName'  => 'Note'
			]
		),
		'invoice_duedate'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			),
			'auditable' => [
				'displayName'  => 'Due Date'
			]
		),
		'invoice_submitteddate'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'invoicetype_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'frequency_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoice_startdate'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'invoice_endate'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'invoice_activityday'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoice_dueday'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoice_paymentmethod'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'invoicepayment_type_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'auditable' => [
				'table'        => 'invoicepayment_type',
				'displayField' => 'invoicepayment_type',
				'displayName'  => 'Paid By'
			]
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
		'imagekey_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoiced_amount'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'initial_amount'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'invoice_reject_note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			),
			'auditable' => [
				'displayName'  => 'Rejection Note'
			]
		),
		'invoice_period'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			),
			'auditable' => []
		),
		'control_amount'	 => array(
			'auditable' => [
				'displayName'  => 'Invoice Total'
			]
		),
		'invoice_multiproperty'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoice_taxallflag'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoice_budgetoverage_note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			),
			'auditable' => [
				'displayName'  => 'Budget Overage Note'
			]
		),
		'invoice_cycle_from'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'invoice_cycle_to'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'vendor_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>16)
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
			),
			'auditable' => []
		),
		'universal_field2'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => []
		),
		'universal_field3'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => []
		),
		'universal_field4'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => []
		),
		'universal_field5'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => []
		),
		'universal_field6'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => []
		),
		'universal_field7'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => []
		),
		'universal_field8'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			),
			'auditable' => []
		),
		'reftablekey_id'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>64)
			)
		),
		'remit_advice'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'auditable' => [
				'displayName'  => 'Remittance Advice'
			]
		),
		'vendoraccess_notes'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			)
		),
		'PriorityFlag_ID_Alt'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'auditable' => [
				'displayName'  => 'Priority'
			]
		),
		'invoice_NeededBy_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			),
			'auditable' => [
				'displayName'  => 'Needed By'
			]
		),
		'payablesconnect_flag'	 => array(),
		'address_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'template_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		)
	);

}
?>