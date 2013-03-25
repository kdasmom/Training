/**
 * Grid for the invoice register's Paid tab 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.grid.RegisterPaid', {
    extend: 'NP.view.invoice.grid.AbstractInvoiceGrid',
    alias: 'widget.invoice.grid.registerpaid',
    
    title: 'Paid',

    cols: ['VendorName','InvoiceAmount','PropertyName','InvoiceNumber','InvoiceDate','InvoiceCreatedDate','InvoiceDueDate']
});