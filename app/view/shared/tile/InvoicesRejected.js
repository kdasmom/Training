/**
 * Grid for Rejected Invoices summary stat
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.InvoicesRejected', {
	extend: 'NP.view.shared.tile.AbstractInvoiceTile',
	
	getCols: function() {
    	return ['InvoiceDate','PropertyName','PriorityFlag','InvoiceNeededByDate','VendorName',
    			'InvoiceNumber','InvoiceAmount','InvoicePendingDays','InvoiceDueDate'];
    }
});