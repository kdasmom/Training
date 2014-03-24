Ext.define('NP.view.systemSetup.gridcol.Name', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.systemsetup.gridcol.name',
	text: NP.Translator.translate('Rule Name'),
    dataIndex: 'wfrule_name',
    flex: 7
});