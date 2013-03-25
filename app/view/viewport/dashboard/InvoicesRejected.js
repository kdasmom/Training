/**
 * Grid for Rejected Invoices summary stat
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.dashboard.InvoicesRejected', {
	extend  : 'NP.view.invoice.grid.AbstractInvoiceGrid',
	alias   : 'widget.viewport.dashboard.invoicesrejected',
	
	cols: ['InvoiceDate','PropertyName','PriorityFlag','InvoiceNeededByDate','VendorName',
    		'InvoiceNumber','InvoiceAmount','InvoicePendingDays','InvoiceDueDate']
});