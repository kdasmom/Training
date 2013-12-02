/**
 * Created by rnixx on 11/11/13.
 */


Ext.define('NP.view.property.gridcol.PropertyApCode', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.property.gridcol.propertyapcode',

	requires: ['NP.lib.core.Config'],

	dataIndex: 'property_id_alt_ap',

	renderer : function(val, meta, rec) {
		if (rec.getProperty) {
			return rec.getProperty().get('property_id_alt_ap');
		}
		return val;
	},

	initComponent: function() {
		this.text = NP.lib.core.Config.getSetting('PN.main.PropertyLabel') + ' Ap Code';

		this.callParent(arguments);
	}
});