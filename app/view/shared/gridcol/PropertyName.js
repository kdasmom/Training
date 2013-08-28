/**
 * Grid column for Property
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.PropertyName', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.PropertyName',

	requires: ['NP.lib.core.Config'],

	dataIndex: 'property_name',
	renderer : function(val, meta, rec) {
		return rec.getProperty().get('property_name');
	},

	initComponent: function() {
		this.text = NP.lib.core.Config.getSetting('PN.main.PropertyLabel');
		
		this.callParent(arguments);
	}
});