/**
 * Grid for Completed Invoices to Approve summary stat
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.dashboard.InvoicesCompleted', {
	extend  : 'NP.view.invoice.grid.AbstractInvoiceGrid',
	alias   : 'widget.viewport.dashboard.invoicescompleted',
	
	cols: ['InvoiceDate','PropertyName','PriorityFlag','InvoiceNeededByDate','VendorName',
    		'InvoiceNumber','InvoiceAmount','InvoicePendingDays','InvoiceDueDate','InvoicePeriod'],

	initComponent: function() {
		this.selModel = Ext.create('Ext.selection.CheckboxModel');

		this.callParent(arguments);
	}
});