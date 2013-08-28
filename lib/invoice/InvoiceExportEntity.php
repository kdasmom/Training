<?php
namespace NP\invoice;

class InvoiceExportEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
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
			)
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
			)
		),
		'property_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoice_ref'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'invoice_note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			)
		),
		'invoice_duedate'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
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
			)
		),
		'invoice_period'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'control_amount'	 => array(),
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
			)
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
		'reftablekey_id'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>64)
			)
		),
		'remit_advice'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendoraccess_notes'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			)
		),
		'PriorityFlag_ID_Alt'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoice_NeededBy_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
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