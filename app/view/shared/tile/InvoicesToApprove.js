/**
 * Grid for Invoices to Approve summary stat
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.InvoicesToApprove', {
	extend: 'NP.view.shared.tile.AbstractInvoiceTile',
	
	getCols: function() {
    	return ['InvoiceDate','PropertyName','VendorName','InvoiceNumber','InvoiceAmount',
    			'InvoicePendingDays','InvoiceDueDate'];
    }
});