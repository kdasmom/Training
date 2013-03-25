/**
 * Grid for the invoice register's Void tab 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.grid.RegisterVoid', {
    extend: 'NP.view.invoice.grid.AbstractInvoiceGrid',
    alias: 'widget.invoice.grid.registervoid',
	
    title: 'Void',

    cols: ['VendorName','InvoiceAmount','PropertyName','InvoiceNumber','InvoiceDate','InvoiceCreatedDate','InvoiceDueDate']
});