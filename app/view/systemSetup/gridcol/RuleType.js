Ext.define('NP.view.systemSetup.gridcol.RuleType', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.systemsetup.gridcol.ruletype',

    requires: ['NP.lib.core.Translator'],

	dataIndex: 'wfruletype_name',

    initComponent: function() {
    	this.text = NP.Translator.translate('Rule Type');

    	this.callParent(arguments);
    }
});