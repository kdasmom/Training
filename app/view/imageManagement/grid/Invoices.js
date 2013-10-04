/**
 * Grid for the Image Management > Image Hub's Invoices tab 
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.imageManagement.grid.Invoices', {
    extend: 'NP.view.imageManagement.grid.AbstractImageGrid',
    alias: 'widget.imageManagement.grid.invoices',
    
    title: 'Invoices',

    cols: ['ScanDate','PropertyName','VendorName','Reference','Amount','InvoiceDate','PriorityFlag','Source']
});