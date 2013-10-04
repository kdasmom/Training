/**
 * Grid for the Image Management's Images To Be Indexed tab 
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.imageManagement.grid.Indexed', {
    extend: 'NP.view.imageManagement.grid.AbstractImageGrid',
    alias: 'widget.imageManagement.grid.indexed',
    
    title: 'Images To Be Indexed',

    cols: ['Name','ScanDate','DocType','PropertyName','VendorName','Source']
});