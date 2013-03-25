/**
 * Grid for the invoice register's Submitted for Payment tab 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.grid.RegisterSubmitted', {
    extend: 'NP.view.invoice.grid.AbstractInvoiceGrid',
    alias: 'widget.invoice.grid.registersubmitted',
    
    title: 'Submitted for Payment',

    cols: ['VendorName','InvoiceAmount','PropertyName','InvoiceNumber','InvoiceDate','InvoiceCreatedDate','InvoiceDueDate']
});