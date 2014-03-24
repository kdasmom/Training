Ext.define('NP.view.systemSetup.gridcol.Status', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.systemsetup.gridcol.status',
	text: NP.Translator.translate('Status'),
    dataIndex: 'wfrule_status'
});