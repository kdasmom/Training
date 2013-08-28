/**
 * Grid column for Received Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.receipt.gridcol.ReceiveDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.receipt.gridcol.receivedate',

	text     : 'Date Received',
	dataIndex: 'receipt_receivedondt'
});