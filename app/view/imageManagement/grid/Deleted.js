/**
 * Grid for the Image Management's Deleted Images tab 
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.imageManagement.grid.Deleted', {
    extend: 'NP.view.imageManagement.grid.AbstractImageGrid',
    alias: 'widget.imageManagement.grid.deleted',
    
    title: 'Deleted Images',

    cols: ['Name','NeededByDate','ScanDate','DocType','PropertyName','VendorName','Reference','Amount']
});