/**
 * Grid for the invoice register's Open tab 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.grid.RegisterOpen', {
    extend: 'NP.view.invoice.grid.AbstractInvoiceGrid',
    alias: 'widget.invoice.grid.registeropen',
    
    title: 'Open',

    cols: ['VendorName','InvoiceAmount','PropertyName','InvoiceNumber','InvoiceDate','InvoiceCreatedDate','InvoiceDueDate']
});