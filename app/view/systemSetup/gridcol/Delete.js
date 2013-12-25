Ext.define('NP.view.systemSetup.gridcol.Delete', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.systemsetup.gridcol.delete',

    text: 'Delete',
    align: 'center',
    flex: 0.3,

    renderer: function(val, meta, rec) {
        return '<img src="resources/images/buttons/delete.gif" title="Delete" alt="Delete" class="action-cell" />';
        return '';
    }
});