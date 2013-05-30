/**
 * Grid column for Property Name
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.gridcol.PropertyName', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.property.gridcol.propertyname',

	requires: ['NP.lib.core.Config'],

	dataIndex: 'property_name',

	initComponent: function() {
		this.text = NP.lib.core.Config.getSetting('PN.main.PropertyLabel');
		
		this.callParent(arguments);
	}
});