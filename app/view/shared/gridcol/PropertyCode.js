/**
 * Grid column for Property Code
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.PropertyCode', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.propertycode',

	requires: ['NP.lib.core.Config'],

	dataIndex: 'property_id_alt',
	renderer : function(val, meta, rec) {
		return rec.getProperty().get('property_id_alt');
	},

	initComponent: function() {
		this.text = NP.lib.core.Config.getSetting('PN.main.PropertyLabel') + ' Code';
		
		this.callParent(arguments);
	}
});