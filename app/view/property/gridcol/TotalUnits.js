/**
 * Grid column for Total Number of Units
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.gridcol.TotalUnits', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.property.gridcol.totalunits',

	requires: ['NP.lib.core.Config'],

	dataIndex: 'property_no_units',

	initComponent: function() {
		this.text = 'Total No. of ' + NP.lib.core.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit');
		
		this.callParent(arguments);
	}
});