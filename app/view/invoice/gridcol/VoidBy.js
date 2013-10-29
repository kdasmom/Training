/**
 * Grid column for Invoice Void By
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.VoidBy', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.invoice.gridcol.voidby',

	text     : 'Voided By',
	dataIndex: 'void_by'
});