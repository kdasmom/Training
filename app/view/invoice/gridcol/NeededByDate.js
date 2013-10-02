/**
 * Grid column for Invoice Needed By Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.NeededByDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.invoice.gridcol.neededbydate',

	text     : 'Needed By',
	dataIndex: 'invoice_neededby_datetm'
});