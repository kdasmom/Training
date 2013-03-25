/**
 * Grid column for Invoice Due Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.InvoiceDueDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.shared.gridcol.invoiceduedate',

	text     : 'Due Date',
	dataIndex: 'invoice_duedate'
});