Ext.define('NP.view.systemSetup.gridcol.Copy', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.systemsetup.gridcol.copy',

    text : 'Copy',
    align: 'center',
    flex: 0.3,

    renderer: function(val, meta, rec) {
        return '<img src="resources/images/buttons/copy.gif" title="Copy" alt="Copy" class="action-cell" />';
    }
});