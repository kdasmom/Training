/**
 * Model for a InvoicePaymentType
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.invoice.InvoicePaymentType', {
	extend: 'Ext.data.Model',
	
	idProperty: 'invoicepayment_type_id',
	fields: [
		{ name: 'invoicepayment_type_id', type: 'int' },
		{ name: 'invoicepayment_type' },
		{ name: 'active', type: 'int' },
		{ name: 'universal_field_status', type: 'int' }
	]
});