/**
 * Generic component to assign pay by types
 *
 * @author Renat Gatyatov
 */
Ext.define('NP.view.systemSetup.PaymentTypeAssigner', {
	extend: 'Ext.ux.form.ItemSelector',
	alias: 'widget.systemSetup.paymenttypeassigner',

	fieldLabel: 'Invoice Total by Pay by',

	name         : 'paymenttype',
	displayField : 'invoicepayment_type',
	valueField   : 'invoicepayment_type_id',
	tpl          : '<tpl for="."><div class="x-boundlist-item">{invoicepayment_type}</div></tpl>',
	fromTitle    : 'Unassigned',
	toTitle      : 'Assigned',
	buttons      : ['add','remove'],
	msgTarget    : 'under',
	autoLoad     : false,

	store: Ext.create('NP.store.invoice.InvoicePaymentTypes', {
		service     : 'InvoiceService',
		action      : 'getPaymentTypes',
		autoLoad	: this.autoLoad,
		fields	    : ['invoicepayment_type_id', 'invoicepayment_type'],
		extraParams : {
			paymentType_id: null
		}
	})
});