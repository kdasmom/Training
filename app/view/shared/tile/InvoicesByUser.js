/**
 * Grid for My Invoices summary stat
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.InvoicesByUser', {
	extend: 'NP.view.shared.tile.AbstractInvoiceTile',
	
	getCols: function() {
    	return ['InvoiceDate','PropertyName','PriorityFlag','VendorName','InvoiceNumber',
    			'InvoicePendingDays','InvoiceAmount','InvoiceStatus'];
    }
});