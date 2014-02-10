Ext.define('NP.view.systemSetup.gridcol.LastUpdated', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.systemsetup.gridcol.lastupdated',

    text     : 'Last Updated',
    dataIndex: 'wfrule_datetm',

    renderer: function(val, meta, rec) {
		return Ext.Date.format(rec.data.wfrule_datetm, NP.Config.getDefaultDateFormat() + ' h:iA') + ' (' + rec.data.userprofile_username + ')';
    }
});