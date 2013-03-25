/**
 * Grid for the invoice register's Overdue tab 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.grid.RegisterOverdue', {
    extend: 'NP.view.invoice.grid.AbstractInvoiceGrid',
    alias: 'widget.invoice.grid.registeroverdue',
    
    title: 'Overdue',

    cols: ['VendorName','InvoiceAmount','PropertyName','InvoiceNumber','InvoiceDate','InvoiceCreatedDate','InvoiceDueDate']
});