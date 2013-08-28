/**
 * Grid column for Date Transferred
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.receipt.gridcol.TransferDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.receipt.gridcol.transferdate',

	text     : 'Date Transferred',
	dataIndex: 'transfer_dt'
});