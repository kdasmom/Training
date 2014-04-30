Ext.define('NP.view.systemSetup.gridcol.Name', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.systemsetup.gridcol.name',

    requires: ['NP.lib.core.Translator'],

	dataIndex: 'wfrule_name',
    flex: 7,

    initComponent: function() {
    	this.text = NP.Translator.translate('Rule Name');

    	this.callParent(arguments);
    }
});