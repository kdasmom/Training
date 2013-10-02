/**
 * Grid column for Notes
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.gridcol.Notes', {
	extend: 'Ext.grid.column.Column',
	alias : 'widget.po.gridcol.notes',

	text     : 'Notes',
	dataIndex: 'purchaseorder_note'
});