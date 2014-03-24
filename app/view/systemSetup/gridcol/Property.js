Ext.define('NP.view.systemSetup.gridcol.property', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.systemsetup.gridcol.property',
	text: NP.Translator.translate('Property'),
	dataIndex: 'count_properties',

	renderer : function(val, meta, rec) {
		return rec.data.all_properties_selected ?
			NP.Translator.translate('ALL') :
			NP.Translator.translate('SPECIFIC');
	}
});