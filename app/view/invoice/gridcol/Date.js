/**
 * Grid column for Invoice Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.Date', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.invoice.gridcol.date',

	text     : 'Date',
	dataIndex: 'invoice_datetm'
});