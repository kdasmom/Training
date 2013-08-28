/**
 * Grid column for Receipt Required
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.gridcol.ReceiptRequired', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.po.gridcol.receiptrequired',

	text     : 'Receipt Required',
	dataIndex: 'purchaseorder_rct_req'
});