/**
 * Grid column for Unit Number
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.gridcol.UnitNumber', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.property.gridcol.unitnumber',

	requires: ['NP.lib.core.Config'],

	dataIndex: 'unit_number',

	renderer : function(val, meta, rec) {
		if (rec.getUnit) {
			return rec.getUnit().get('unit_number');
		}
		return val;
	},

	initComponent: function() {
		this.text = NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit');
		
		this.callParent(arguments);
	}
});