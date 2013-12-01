Ext.define('NP.view.image.gridcol.Type', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.image.gridcol.type',

    text     : 'Type',
    dataIndex: 'tableref_id',
    renderer : function(val, meta, rec) {
        if (val === '3') {
            return 'PO';
        } else {
            return 'Receipt';
        }
    }
});