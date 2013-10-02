/**
 * Grid column for Invoice Created Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.CreatedDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.invoice.gridcol.createddate',

	text     : 'Date Created',
	dataIndex: 'invoice_createddatetm'
});