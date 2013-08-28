/**
 * Grid column for Created Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.receipt.gridcol.CreatedDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.receipt.gridcol.createddate',

	text     : 'Date Created',
	dataIndex: 'receipt_createdt'
});