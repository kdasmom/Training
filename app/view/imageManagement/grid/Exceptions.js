/**
 * Grid for the Image Management > Image Hub's Exceptions tab 
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.imageManagement.grid.Exceptions', {
    extend: 'NP.view.imageManagement.grid.AbstractImageGrid',
    alias: 'widget.imageManagement.grid.exceptions',
    
    title: 'Exceptions',
    
    cols: ['ScanDate','DocType','PropertyName','VendorName','Reference','Amount','ExceptionBy','DueDate']
});