/**
 * Created by Andrey Baranov
 * date: 1/21/14 2:17 PM
 */

Ext.define('NP.view.systemSetup.gridcol.FieldType', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.systemsetup.gridcol.fieldtype',

	requires: ['NP.lib.core.Translator'],

	text     : 'Field Type',
	dataIndex: 'type',

	initComponent: function() {
		this.text = NP.Translator.translate(this.text);

		this.renderer = function(val, meta, record) {
			switch (val) {
				default:
					return val;
				case 'select':
					return 'Drop-Box';
				case 'date':
					return 'Date';
			}
			return val;
		};

		this.callParent(arguments);
	}
});