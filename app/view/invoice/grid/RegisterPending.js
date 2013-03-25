/**
 * Grid for the invoice register's Pending tab 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.grid.RegisterPending', {
    extend: 'NP.view.invoice.grid.AbstractInvoiceGrid',
    alias: 'widget.invoice.grid.registerpending',
    
    title: 'Pending',

    cols: ['VendorName','InvoiceAmount','PropertyName','InvoiceNumber','InvoiceDate','InvoiceCreatedDate','InvoiceDueDate']
});