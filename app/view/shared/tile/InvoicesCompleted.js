/**
 * Grid for Completed Invoices to Approve summary stat
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.InvoicesCompleted', {
	extend: 'NP.view.shared.tile.AbstractInvoiceTile',
	
	getCols: function() {
    	return ['InvoiceDate','PropertyName','PriorityFlag','InvoiceNeededByDate','VendorName',
    			'InvoiceNumber','InvoiceAmount','InvoicePendingDays','InvoiceDueDate','InvoicePeriod'];
    }
});