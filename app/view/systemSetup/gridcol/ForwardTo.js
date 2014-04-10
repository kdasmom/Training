Ext.define('NP.view.systemSetup.gridcol.ForwardTo', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.systemsetup.gridcol.forwardto',

    requires: ['NP.lib.core.Translator'],

	dataIndex: 'forwards',

    initComponent: function() {
    	this.text = NP.Translator.translate('Forward To');

    	this.callParent(arguments);
    }
});