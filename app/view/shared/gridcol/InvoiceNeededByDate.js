/**
 * Grid column for Invoice Needed By Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.InvoiceNeededByDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.shared.gridcol.invoiceneededbydate',

	text     : 'Needed By',
	dataIndex: 'invoice_neededby_datetm'
});