/**
 * Grid column for Period
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.receipt.gridcol.Period', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.receipt.gridcol.period',

	text     : 'Period',
	dataIndex: 'receipt_period',
	format   : 'm/Y'
});