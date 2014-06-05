Ext.define('NP.view.systemSetup.gridcol.LastUpdated', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.systemsetup.gridcol.lastupdated',

    requires: ['NP.lib.core.Translator'],

	dataIndex: 'wfrule_datetm',

    initComponent: function() {
    	this.text = NP.Translator.translate('Last Updated');

    	this.callParent(arguments);
    },

    renderer: function(val, meta, rec) {
		return Ext.Date.format(rec.data.wfrule_datetm, NP.Config.getDefaultDateTimeFormat()) + ' (' + rec.data.userprofile_username + ')';
    }
});