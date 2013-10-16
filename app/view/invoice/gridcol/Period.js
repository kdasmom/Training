/**
 * Grid column for Invoice Period
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.Period', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.invoice.gridcol.period',

	text     : 'Post Date',
	dataIndex: 'invoice_period',
	format   : 'm/Y'
});