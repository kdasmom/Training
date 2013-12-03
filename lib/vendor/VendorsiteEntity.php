<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 10/9/13
 * Time: 6:11 PM
 */

namespace NP\vendor;


use NP\core\AbstractEntity;

class VendorsiteEntity extends AbstractEntity {

	protected $fields = array(
		'vendorsite_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendorsite_id_alt'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vendor_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendorsite_lastupdate_date'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'vendorsite_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>15)
			)
		),
		'vendorsite_purchasing_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_rfq_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_pay_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_ar_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_customernum'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendorsite_ship_to_location_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendorsite_bill_to_location_id'	 => array(
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
		'bill_contact_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendorsite_inactivedatetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'paymentmethod_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendorsite_bank_accname'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>80)
			)
		),
		'vendorsite_bank_accnum'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>30)
			)
		),
		'vendorsite_banknum'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendorsite_bank_acctype'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendorsite_termsdatebasis'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
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
		'paygroup_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendorsite_paypriority'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'term_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendorsite_invoice_maxamount'	 => array(
			'validation' => array(
				'numeric' => array()
			)
		),
		'paydatebasis_code'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendorsite_takedisc_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_invoice_currency'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>15)
			)
		),
		'vendorsite_payment_currency'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>15)
			)
		),
		'vendorsite_paymenthold_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_paymenthold_fut_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_paymenthold_reason'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>240)
			)
		),
		'vendorsite_hold_unmatched_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_tax_rounding'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_tax_calc_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_tax_calc_override'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_tax_included_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_exclusive_payment_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_tax_reporting_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_validationnum'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendorsite_discount_exclude_freight'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_check_digits'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>30)
			)
		),
		'vendorsite_ap_bank_number'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>30)
			)
		),
		'vendorsite_language'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>30)
			)
		),
		'vendorsite_awt_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_edi_tran'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendorsite_edi_idnum'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>30)
			)
		),
		'vendorsite_edi_payment_method'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendorsite_edi_payment_format'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendorsite_edi_remit_method'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendorsite_bank_charge_bearer'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>10)
			)
		),
		'vendorsite_edi_remit_instruct'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>256)
			)
		),
		'vendorsite_bank_branchtype'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendorsite_pay_on'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendorsite_receipt_summary'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendorsite_ece_tp_location'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vendorsite_proc_card_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_match'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'vendorsite_country_origin'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2)
			)
		),
		'vendorsite_debit_memo_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_offset_tax_flag'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_supplier_notif_method'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'table_status'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		),
		'vendorsite_status'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'vendorsite_note'	 => array(
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
		'vendorsite_reject_note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			)
		),
		'vendorsite_createddatetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'vendorsite_DaysNotice_InsuranceExpires'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendor_universalfield1'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'vendorsite_account_number'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'vendorsite_display_account_number_po'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>1)
			)
		)
	);

}