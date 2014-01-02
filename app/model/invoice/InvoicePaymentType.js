/**
 * Model for a InvoicePaymentType
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.invoice.InvoicePaymentType', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'invoicepayment_type_id',
	fields: [
		{ name: 'invoicepayment_type_id', type: 'int' },
		{ name: 'invoicepayment_type' },
		{ name: 'active', type: 'int' },
		{ name: 'universal_field_status', type: 'int' }
	],

	validations: [
		{ field: 'invoicepayment_type', type: 'length', max: 50 },
		{ field: 'invoicepayment_type_code', type: 'length', max: 50 }
	]
});