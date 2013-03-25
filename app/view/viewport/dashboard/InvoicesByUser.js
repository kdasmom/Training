/**
 * Grid for My Invoices summary stat
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.dashboard.InvoicesByUser', {
	extend : 'NP.view.invoice.grid.AbstractInvoiceGrid',
	alias  : 'widget.viewport.dashboard.invoicesbyuser',
	
	cols: ['InvoiceDate','PropertyName','PriorityFlag','VendorName','InvoiceNumber','InvoicePendingDays','InvoiceAmount','InvoiceStatus']
});