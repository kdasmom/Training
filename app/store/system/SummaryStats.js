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
				title    : this.invoicesToApproveText,	// This is the name of the summary stat and title of the detail grid
				name     : 'InvoicesToApprove',			// This is the name of the grid in /view/viewport/dashboard and the service function called (getInvoicesToApprove)
				store    : 'invoice.Invoice',			// The name of the data store to use when retrieving the data from the service
				service  : 'InvoiceService',			// The service to call to retrieve the data
				module_id: 1053							// The module permission needed to see this summary stat
			},{
				title    : this.invoicesOnHoldText,
				name     : 'InvoicesOnHold',
				store    : 'invoice.Invoice',
				service  : 'InvoiceService',
				module_id: 6052
			},{
				title    : this.invoicesCompletedText,
				name     : 'InvoicesCompleted',
				store    : 'invoice.Invoice',
				service  : 'InvoiceService',
				module_id: 2004
			},{
				title    : this.invoicesRejectedText,
				name     : 'InvoicesRejected',
				store    : 'invoice.Invoice',
				service  : 'InvoiceService',
				module_id: 6036
			},{
				title    : this.invoicesMyText,
				name     : 'InvoicesByUser',
				store    : 'invoice.Invoice',
				service  : 'InvoiceService',
				module_id: 2060
			}
	    ];

		this.callParent(arguments);
	}
});