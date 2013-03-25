/**
 * Grid for the invoice register's Template tab 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.grid.RegisterTemplate', {
    extend: 'NP.view.invoice.grid.AbstractInvoiceGrid',
    alias: 'widget.invoice.grid.registertemplate',
    
    title: 'Template',

    cols: ['VendorName','InvoiceAmount','PropertyName','InvoiceNumber','InvoiceDate','InvoiceCreatedDate','InvoiceDueDate']
});