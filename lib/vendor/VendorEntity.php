<?php
namespace NP\vendor;

/**
 * Entity class for Vendor
 *
 * @author 
 */
class VendorEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'vendor_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_id_alt'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vendor_insurancenumber'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vendor_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>500)
			)
		),
		'vendor_number'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>30)
			)
		),
		'vendor_enabled_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_summary_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_fedid'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>30)
			)
		),
		'default_glaccount_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'default_paymenttype_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_w9onfile'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vendor_anticorruption'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vendor_suppliernum'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>30)
			)
		),
		'vendor_type_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'organization_type_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendortype_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendorclass_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_customernum'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendor_onetime_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_parent'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_minorder'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'vendor_ship_to_location_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_bill_to_location_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'shipvia_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'freightterms_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'fob_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'term_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'paydatebasis_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'paygroup_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendor_paypriority'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_invoice_currency'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>15)
			)
		),
		'vendor_payment_currency'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>15)
			)
		),
		'vendor_invoice_maxamount'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'vendor_paymenthold_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_paymenthold_fut_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_paymenthold_reason'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>240)
			)
		),
		'acctspay_glcodecombination_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'prepay_glcodecombination_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_type1099'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'withholdingstatus_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendor_withhold_startdate'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'vendor_active_startdate'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'vendor_active_enddate'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'minoritygroup_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'paymentmethod_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendor_bank_accname'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>80)
			)
		),
		'vendor_bank_accnum'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>30)
			)
		),
		'vendor_banknum'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendor_bank_acctype'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendor_women_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_smallbusiness_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_industry_class'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendor_purchasehold_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'purchasehold_userprofile_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_purchasehold_reason'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>240)
			)
		),
		'vendor_purchasehold_date'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'vendor_termsdatebasis'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendor_inspectionreq_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_receiptreq_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_qty_received_tolerance'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'qty_received_exception_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendor_allowsub_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_allowunordered_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_holdunmatched_invc_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_exclusive_payment_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_tax_rounding'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_tax_calc_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_tax_calc_override'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_amt_include_tax_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_tax_verif_date'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'vendor_name_control'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>4)
			)
		),
		'vendor_state_report_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_fed_report_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_auto_calc_interest_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_validationnum'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_discount_exclude_freight'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_tax_reporting_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>80)
			)
		),
		'vendor_check_digits'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>30)
			)
		),
		'vendor_ap_bank_number'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>30)
			)
		),
		'vendor_awt_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_edi_tran'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendor_edi_payment_method'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendor_edi_payment_format'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendor_edi_remit_method'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendor_bank_charge_bearer'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'vendor_edi_remit_instruct'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>256)
			)
		),
		'vendor_match'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendor_debit_memo_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_offset_tax_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_status'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vendor_lastupdate_date'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'table_status'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendor_add_reason'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'vendor_note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>4000)
			)
		),
		'approval_tracking_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'submit_userprofile_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_reject_note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			)
		),
		'integration_package_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_createddatetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'finance_vendor'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'default_due_date'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_reject_dt'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'vendor_reject_userprofile_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'taxpayor_type'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'payee_type'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_ModificationType'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'remit_req'	 => array(),
		'insurance_req'	 => array()
	);

}
