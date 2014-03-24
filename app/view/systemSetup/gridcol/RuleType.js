Ext.define('NP.view.systemSetup.gridcol.RuleType', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.systemsetup.gridcol.ruletype',
	text: NP.Translator.translate('Rule Type'),
    dataIndex: 'wfruletype_name'
});