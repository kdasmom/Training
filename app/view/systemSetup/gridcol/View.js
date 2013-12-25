Ext.define('NP.view.systemSetup.gridcol.View', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.systemsetup.gridcol.view',

    text: 'View',
    align: 'center',
    flex: 0.3,

    renderer: function(val, meta, rec) {
        return '<img src="resources/images/buttons/view.gif" title="View" alt="View" class="action-cell" />';
    }
});