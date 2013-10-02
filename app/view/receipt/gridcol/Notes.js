/**
 * Grid column for Notes
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.receipt.gridcol.Notes', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.receipt.gridcol.notes',

	text     : 'Notes',
	dataIndex: 'receipt_note'
});