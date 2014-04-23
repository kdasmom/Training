Ext.define('NP.view.systemSetup.gridcol.FromUser', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.systemsetup.gridcol.fromuser',

    requires: ['NP.lib.core.Translator'],

	dataIndex: 'onames',

    initComponent: function() {
    	this.text = NP.Translator.translate('Group/User');

    	this.callParent(arguments);
    }
});