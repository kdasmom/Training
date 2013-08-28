/**
 * Grid column for Created Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.gridcol.CreatedDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.po.gridcol.createddate',

	text     : 'Date Created',
	dataIndex: 'purchaseorder_created'
});