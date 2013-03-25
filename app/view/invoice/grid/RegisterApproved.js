/**
 * Grid for the invoice register's Approved tab 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.grid.RegisterApproved', {
    extend: 'NP.view.invoice.grid.AbstractInvoiceGrid',
    alias: 'widget.invoice.grid.registerapproved',
    
    title: 'Approved',

    cols: ['VendorName','InvoiceAmount','PropertyName','InvoiceNumber','InvoiceDate','InvoiceCreatedDate','InvoiceDueDate']
});