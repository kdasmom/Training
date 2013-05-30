/**
 * Grid column for Region
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.gridcol.RegionName', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.property.gridcol.regionname',

	requires: ['NP.lib.core.Config'],

	dataIndex: 'region_name',

	initComponent: function() {
		this.text = NP.Config.getSetting('PN.main.RegionLabel', 'Region');
		
		this.callParent(arguments);
	}
});