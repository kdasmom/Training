/**
 * Grid column for Property Code
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.gridcol.Code', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.property.gridcol.code',

	requires: ['NP.lib.core.Config'],

	dataIndex: 'property_id_alt',

	initComponent: function() {
		this.text = NP.lib.core.Config.getSetting('PN.main.PropertyLabel', 'Property') + ' Code';
		
		this.callParent(arguments);
	}
});