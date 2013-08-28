/**
 * Grid column for Property Code
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.gridcol.PropertyCode', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.property.gridcol.propertycode',

	requires: ['NP.lib.core.Config'],

	dataIndex: 'property_id_alt',
	
	renderer : function(val, meta, rec) {
		if (rec.getProperty) {
			return rec.getProperty().get('property_id_alt');
		}
		return val;
	},

	initComponent: function() {
		this.text = NP.lib.core.Config.getSetting('PN.main.PropertyLabel') + ' Code';
		
		this.callParent(arguments);
	}
});