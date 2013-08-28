/**
 * Grid for Invoices On Hold summary stat
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.InvoicesOnHold', {
	extend: 'NP.view.shared.tile.AbstractInvoiceTile',
	
	getCols: function() {
    	return ['PropertyName','VendorName','InvoiceAmount','InvoiceNumber','InvoiceDate',
    			'InvoiceHoldDate','InvoiceDaysOnHold','InvoiceOnHoldBy'];
    }
});