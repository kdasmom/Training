/**
 * Grid for the Image Management > Image Hub's POs tab 
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.imageManagement.grid.POs', {
    extend: 'NP.view.imageManagement.grid.AbstractImageGrid',
    alias: 'widget.imageManagement.grid.pos',
    
    title: 'POs',

    cols: ['ScanDate','DocType','PropertyName','VendorName','Reference','Amount','Source']
});