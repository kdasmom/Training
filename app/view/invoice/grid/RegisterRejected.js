/**
 * Grid for the invoice register's Rejected tab 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.grid.RegisterRejected', {
    extend: 'NP.view.invoice.grid.AbstractInvoiceGrid',
    alias: 'widget.invoice.grid.registerrejected',
    
    title: 'Rejected',

    cols: ['VendorName','InvoiceAmount','PropertyName','InvoiceNumber','InvoiceDate','InvoiceCreatedDate','InvoiceDueDate',
            'InvoiceCreatedBy','InvoiceRejectedDate','InvoiceRejectedBy']
});