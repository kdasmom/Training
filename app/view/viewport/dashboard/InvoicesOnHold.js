/**
 * Grid for Invoices On Hold summary stat
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.dashboard.InvoicesOnHold', {
	extend : 'NP.view.invoice.grid.AbstractInvoiceGrid',
	alias  : 'widget.viewport.dashboard.invoicesonhold',
	
	cols: ['PropertyName','VendorName','InvoiceAmount','InvoiceNumber','InvoiceDate',
    		'InvoiceHoldDate','InvoiceDaysOnHold','InvoiceOnHoldBy']
});