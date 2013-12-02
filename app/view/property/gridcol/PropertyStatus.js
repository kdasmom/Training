/**
 * Created by rnixx on 11/11/13.
 */

Ext.define('NP.view.property.gridcol.PropertyStatus', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.property.gridcol.propertystatus',

	requires: ['NP.lib.core.Config', 'NP.lib.core.Translator'],

	dataIndex: 'property_status',

	renderer : function(val, meta, rec) {
		if (val == 1) {
			return NP.Translator.translate('Current');
		}
		if (val == 0) {
			return NP.Translator.translate('Inactive');
		}
		if (val == -1) {
			return NP.Translator.translate('On hold');
		}
	},

	initComponent: function() {
		this.text = NP.Translator.translate('Property status');

		this.callParent(arguments);
	}
});