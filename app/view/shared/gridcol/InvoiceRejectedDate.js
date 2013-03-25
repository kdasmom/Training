/**
 * Grid column for Invoice Rejected Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.InvoiceRejectedDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.shared.gridcol.invoicerejecteddate',

	text     : 'Rejected Date',
	dataIndex: 'rejected_datetm'
});