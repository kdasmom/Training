/**
 * Grid for the invoice register's Transferred to GL tab 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.grid.RegisterTransferred', {
    extend: 'NP.view.invoice.grid.AbstractInvoiceGrid',
    alias: 'widget.invoice.grid.registertransferred',
	
    title: 'Transferred to GL',

    cols: ['VendorName','InvoiceAmount','PropertyName','InvoiceNumber','InvoiceDate','InvoiceCreatedDate','InvoiceDueDate']
});