/**
 * Grid column for Invoice Due Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.DueDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.invoice.gridcol.duedate',

	text     : 'Due Date',
	dataIndex: 'invoice_duedate'
});