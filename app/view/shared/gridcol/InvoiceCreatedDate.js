/**
 * Grid column for Invoice Created Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.InvoiceCreatedDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.shared.gridcol.invoicecreateddate',

	text     : 'Date Created',
	dataIndex: 'invoice_createddatetm'
});