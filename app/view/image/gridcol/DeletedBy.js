/**
 * Grid column for Deleted By
 */
Ext.define('NP.view.image.gridcol.DeletedBy', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.image.gridcol.deletedby',

    text     : 'Deleted By',
    dataIndex: 'deletedby_username'
});