/**
 * Grid column for Image Source
 */
Ext.define('NP.view.image.gridcol.ScanSource', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.image.gridcol.scansource',

    text     : 'Source',
    dataIndex: 'invoiceimage_source_name',
    renderer : function(val, meta, rec) {
        return 'admin';
    }
});