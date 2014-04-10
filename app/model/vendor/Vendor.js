/**
 * Model for a Vendor
 *
 * @author 
 */
Ext.define('NP.model.vendor.Vendor', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config',
		'NP.model.contact.Address',
		'NP.model.contact.Phone'
	],

	idProperty: 'vendor_id',
	fields: [
		{ name: 'vendor_id', type: 'int' },
		{ name: 'vendor_id_alt' },
		{ name: 'vendor_insurancenumber' },
		{ name: 'vendor_name' },
		{ name: 'vendor_number' },
		{ name: 'vendor_enabled_flag' },
		{ name: 'vendor_summary_flag' },
		{ name: 'vendor_fedid' },
		{ name: 'default_glaccount_id', type: 'int' },
		{ name: 'default_paymenttype_id', type: 'int' },
		{ name: 'vendor_w9onfile' },
		{ name: 'vendor_anticorruption' },
		{ name: 'vendor_suppliernum' },
		{ name: 'vendor_type_code' },
		{ name: 'organization_type_code' },
		{ name: 'vendortype_id', type: 'int' },
		{ name: 'vendorclass_id', type: 'int' },
		{ name: 'vendor_customernum' },
		{ name: 'vendor_onetime_flag' },
		{ name: 'vendor_parent', type: 'int' },
		{ name: 'vendor_minorder' },
		{ name: 'vendor_ship_to_location_id', type: 'int' },
		{ name: 'vendor_bill_to_location_id', type: 'int' },
		{ name: 'shipvia_code' },
		{ name: 'freightterms_code' },
		{ name: 'fob_code' },
		{ name: 'term_id', type: 'int' },
		{ name: 'paydatebasis_code' },
		{ name: 'paygroup_code' },
		{ name: 'vendor_paypriority', type: 'int' },
		{ name: 'vendor_invoice_currency' },
		{ name: 'vendor_payment_currency' },
		{ name: 'vendor_invoice_maxamount' },
		{ name: 'vendor_paymenthold_flag' },
		{ name: 'vendor_paymenthold_fut_flag' },
		{ name: 'vendor_paymenthold_reason' },
		{ name: 'acctspay_glcodecombination_id', type: 'int' },
		{ name: 'prepay_glcodecombination_id', type: 'int' },
		{ name: 'vendor_type1099' },
		{ name: 'withholdingstatus_code' },
		{ name: 'vendor_withhold_startdate', type: 'date' },
		{ name: 'vendor_active_startdate', type: 'date' },
		{ name: 'vendor_active_enddate', type: 'date' },
		{ name: 'minoritygroup_code' },
		{ name: 'paymentmethod_code' },
		{ name: 'vendor_bank_accname' },
		{ name: 'vendor_bank_accnum' },
		{ name: 'vendor_banknum' },
		{ name: 'vendor_bank_acctype' },
		{ name: 'vendor_women_flag' },
		{ name: 'vendor_smallbusiness_flag' },
		{ name: 'vendor_industry_class' },
		{ name: 'vendor_purchasehold_flag' },
		{ name: 'purchasehold_userprofile_id', type: 'int' },
		{ name: 'vendor_purchasehold_reason' },
		{ name: 'vendor_purchasehold_date', type: 'date' },
		{ name: 'vendor_termsdatebasis' },
		{ name: 'vendor_inspectionreq_flag' },
		{ name: 'vendor_receiptreq_flag' },
		{ name: 'vendor_qty_received_tolerance', type: 'int' },
		{ name: 'qty_received_exception_code' },
		{ name: 'vendor_allowsub_flag' },
		{ name: 'vendor_allowunordered_flag' },
		{ name: 'vendor_holdunmatched_invc_flag' },
		{ name: 'vendor_exclusive_payment_flag' },
		{ name: 'vendor_tax_rounding' },
		{ name: 'vendor_tax_calc_flag' },
		{ name: 'vendor_tax_calc_override' },
		{ name: 'vendor_amt_include_tax_flag' },
		{ name: 'vendor_tax_verif_date', type: 'date' },
		{ name: 'vendor_name_control' },
		{ name: 'vendor_state_report_flag' },
		{ name: 'vendor_fed_report_flag' },
		{ name: 'vendor_auto_calc_interest_flag' },
		{ name: 'vendor_validationnum', type: 'int' },
		{ name: 'vendor_discount_exclude_freight' },
		{ name: 'vendor_tax_reporting_name' },
		{ name: 'vendor_check_digits' },
		{ name: 'vendor_ap_bank_number' },
		{ name: 'vendor_awt_flag' },
		{ name: 'vendor_edi_tran' },
		{ name: 'vendor_edi_payment_method' },
		{ name: 'vendor_edi_payment_format' },
		{ name: 'vendor_edi_remit_method' },
		{ name: 'vendor_bank_charge_bearer' },
		{ name: 'vendor_edi_remit_instruct' },
		{ name: 'vendor_match' },
		{ name: 'vendor_debit_memo_flag' },
		{ name: 'vendor_offset_tax_flag' },
		{ name: 'vendor_status' },
		{ name: 'vendor_lastupdate_date', type: 'date' },
		{ name: 'table_status' },
		{ name: 'vendor_add_reason' },
		{ name: 'vendor_note' },
		{ name: 'approval_tracking_id', type: 'int' },
		{ name: 'submit_userprofile_id', type: 'int' },
		{ name: 'vendor_reject_note' },
		{ name: 'integration_package_id', type: 'int' },
		{ name: 'vendor_createddatetm', type: 'date' },
		{ name: 'finance_vendor', type: 'int' },
		{ name: 'default_due_date', type: 'int' },
		{ name: 'vendor_reject_dt', type: 'date' },
		{ name: 'vendor_reject_userprofile_id', type: 'int' },
		{ name: 'taxpayor_type', type: 'int' },
		{ name: 'payee_type', type: 'int' },
		{ name: 'vendor_ModificationType' },
		{ name: 'remit_req', type: 'int' },
		{ name: 'insurance_req', type: 'int' },

		// This field does not exist in the DB, we are retrieving it to simplify
		{ name: 'integration_package_name' },

		{ name: 'vendorsite_id', type: 'int' },
		{ name: 'vendorsite_status' },

		{ name: 'sent_for_approval_date', type: 'date' },
		{ name: 'sent_for_approval_by' },

		{ name: 'address_line1', useNull: false },
		{ name: 'address_line2', useNull: false },
		{ name: 'address_line3', useNull: false },
		{ name: 'address_city', useNull: false },
		{ name: 'address_state', useNull: false },
		{ name: 'address_zip', useNull: false },
		{ name: 'address_zipext', useNull: false },
		{ name: 'address_country', type: 'int' },

		{ name: 'phone_number', useNull: false },
		{ name: 'phone_ext', useNull: false },
		{ name: 'phone_countrycode', useNull: false },

		{ name: 'glaccount_id', type: 'int' },
		{ name: 'glaccount_number' },
		{ name: 'glaccount_name' },

		{ name: 'vendortype_name' },

		{ name: 'is_utility_vendor', type: 'int' }
	],

    getAddressHtml: function() {
    	var address = Ext.create('NP.model.contact.Address', this.getData());

    	return address.getHtml();
    },

    getFullPhone: function() {
    	var phone = Ext.create('NP.model.contact.Phone', this.getData());

    	return phone.getFullPhone();
    }
});