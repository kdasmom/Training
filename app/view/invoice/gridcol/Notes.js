/**
 * Grid column for Notes
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.Notes', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.invoice.gridcol.notes',

	text     : 'Notes',
	dataIndex: 'invoice_note'
});