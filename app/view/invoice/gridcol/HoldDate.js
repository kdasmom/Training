/**
 * Grid column for Invoice On Hold Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.HoldDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.invoice.gridcol.holddate',

	text     : 'On Hold Date',
	dataIndex: 'invoice_hold_datetm'
});