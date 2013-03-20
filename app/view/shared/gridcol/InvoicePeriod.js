Ext.define('NP.view.shared.gridcol.InvoicePeriod', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.shared.gridcol.invoiceperiod',

	text     : 'Post Date',
	dataIndex: 'invoice_period'
});