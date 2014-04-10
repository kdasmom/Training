Ext.define('NP.view.systemSetup.gridcol.Status', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.systemsetup.gridcol.status',

    requires: ['NP.lib.core.Translator'],

	dataIndex: 'wfrule_status',

    initComponent: function() {
    	this.text = NP.Translator.translate('Status');

    	this.callParent(arguments);
    }
});