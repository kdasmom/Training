/**
 * Grid for the invoice register's On Hold tab 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.grid.RegisterOnHold', {
    extend: 'NP.view.invoice.grid.AbstractInvoiceGrid',
    alias: 'widget.invoice.grid.registeronhold',
    
    title: 'On Hold',

    cols: ['VendorName','InvoiceAmount','PropertyName','InvoiceNumber','InvoiceDate','InvoiceCreatedDate','InvoiceDueDate']
});