Ext.define('NP.view.shared.gridcol.PropertyName', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.propertyname',

	requires: ['NP.lib.core.Config'],

	dataIndex: 'property_name',

	initComponent: function() {
		this.text = NP.lib.core.Config.getSetting('PN.main.PropertyLabel');
		
		this.callParent(arguments);
	}
});