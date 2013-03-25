/**
 * Store for Summary Stats. This is a static store, it does not use an Ajax proxy. Additional summary stats
 * should be added here to be used by other parts of the app.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.system.SummaryStats', {
	extend: 'Ext.data.Store',
	
	fields: ['title','name','model','service','module_id'],
	
	invoicesToApproveText: 'Invoices to Approve',
	invoicesOnHoldText   : 'Invoices on Hold',
	invoicesCompletedText: 'Completed Invoices to Approve',
	invoicesRejectedText : 'Rejected Invoices',
	invoicesMyText       : 'My Invoices',

	constructor: function() {
		this.data = [
	    	{
				title    : this.invoicesToApproveText,
				name     : 'InvoicesToApprove',
				model    : 'invoice.Invoice',
				service  : 'InvoiceService',
				module_id: 1053
			},{
				title    : this.invoicesOnHoldText,
				name     : 'InvoicesOnHold',
				model    : 'invoice.Invoice',
				service  : 'InvoiceService',
				module_id: 6052
			},{
				title    : this.invoicesCompletedText,
				name     : 'InvoicesCompleted',
				model    : 'invoice.Invoice',
				service  : 'InvoiceService',
				module_id: 2004
			},{
				title    : this.invoicesRejectedText,
				name     : 'InvoicesRejected',
				model    : 'invoice.Invoice',
				service  : 'InvoiceService',
				module_id: 6036
			},{
				title    : this.invoicesMyText,
				name     : 'InvoicesByUser',
				model    : 'invoice.Invoice',
				service  : 'InvoiceService',
				module_id: 2060
			}
	    ];

		this.callParent(arguments);
	}
});