/**
 * Grid column for Invoice Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.InvoiceDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.shared.gridcol.invoicedate',

	text     : 'Date',
	dataIndex: 'invoice_datetm'
});