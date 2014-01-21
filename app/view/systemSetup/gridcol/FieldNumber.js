/**
 * Created by Andrey Baranov
 * date: 1/20/14 2:36 PM
 */


Ext.define('NP.view.systemSetup.gridcol.FieldNumber', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.systemsetup.gridcol.fieldnumber',

	requires: ['NP.lib.core.Translator'],

	text     : 'Field Number',
	dataIndex: 'controlpanelitem_name',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.renderer = function(val, meta, rec) {
			return val[val.length - 1];
		};

		this.callParent(arguments);
	}
});