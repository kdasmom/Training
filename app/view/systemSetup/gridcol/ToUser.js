Ext.define('NP.view.systemSetup.gridcol.ToUser', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.systemsetup.gridcol.touser',

    requires: ['NP.lib.core.Translator'],

	dataIndex: 'names',

    initComponent: function() {
    	this.text = NP.Translator.translate('Group/User');

    	this.callParent(arguments);
    }
});