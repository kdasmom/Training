/**
 * Grid for Invoices to Approve summary stat
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.dashboard.InvoicesToApprove', {
	extend : 'NP.view.invoice.grid.AbstractInvoiceGrid',
	alias  : 'widget.viewport.dashboard.invoicestoapprove',
	
	cols: ['InvoiceDate','PropertyName','VendorName','InvoiceNumber','InvoiceAmount',
    		'InvoicePendingDays','InvoiceDueDate']
});