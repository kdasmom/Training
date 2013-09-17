/**
 * Model for a InvoicePayment
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.invoice.InvoicePayment', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'invoicepayment_id',
	fields: [
		{ name: 'invoicepayment_id', type: 'int' },
		{ name: 'invoice_id', type: 'int' },
		{ name: 'invoicepayment_number', type: 'int' },
		{ name: 'invoicepayment_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'invoicepayment_checknum' },
		{ name: 'invoicepayment_amount', type: 'float' },
		{ name: 'invoicepayment_status_id', type: 'int' },
		{ name: 'checkbook_id', type: 'int' },
		{ name: 'invoicepayment_status' },
		{ name: 'paid', type: 'int' },
		{ name: 'invoicepayment_group_id', type: 'int' },
		{ name: 'invoicepayment_reject_note' },
		{ name: 'invoicepayment_id_alt' },
		{ name: 'invoicepayment_checkcleared_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'VP_invoice_id', type: 'int' },
		{ name: 'invoicepayment_applied_amount' },
		{ name: 'invoicepayment_paid_by', type: 'int' },
		{ name: 'invoicepayment_type_id', type: 'int' },
		{ name: 'invoicepayment_paid_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'invoicepayment_voided_id', type: 'int' },
		{ name: 'property_id', type: 'int' },
		{ name: 'invoicepayment_paid_by_delegation_to', type: 'int' }
	]
});