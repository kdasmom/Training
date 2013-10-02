/**
 * Grid column for PO Number
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.gridcol.Number', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.po.gridcol.number',

	text     : 'PO Number',
	dataIndex: 'purchaseorder_ref',

	renderer : function(val, meta, rec) {
		return rec.getDisplayNumber();
	}
});