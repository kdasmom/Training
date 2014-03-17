<?php
namespace NP\invoice;

class InvoicePaymentEntity extends \NP\core\AbstractEntity {
	

	protected $fields = array(
		'invoicepayment_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoice_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoicepayment_number'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoicepayment_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'invoicepayment_checknum'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'invoicepayment_amount'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'invoicepayment_status_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'checkbook_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoicepayment_status'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'paid'	 => array(
			'defaultValue' => 1,
			'validation' => array(
				'digits' => array()
			)
		),
		'invoicepayment_group_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoicepayment_reject_note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			)
		),
		'invoicepayment_id_alt'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>64)
			)
		),
		'invoicepayment_checkcleared_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'VP_invoice_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoicepayment_applied_amount'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'invoicepayment_paid_by'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoicepayment_type_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoicepayment_paid_datetm'	 => array(
			'timestamp' => 'created',
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'invoicepayment_voided_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'property_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoicepayment_paid_by_delegation_to'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>