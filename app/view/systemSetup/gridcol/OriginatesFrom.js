Ext.define('NP.view.systemSetup.gridcol.OriginatesFrom', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.systemsetup.gridcol.originatesfrom',

    requires: ['NP.lib.core.Translator'],

	dataIndex: 'originator',

    initComponent: function() {
    	this.text = NP.Translator.translate('Originates From');

    	this.callParent(arguments);
    }
});