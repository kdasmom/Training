/**
 * Grid column for Entity Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.gridcol.Date', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.po.gridcol.date',

	text     : 'Date',
	dataIndex: 'purchaseorder_datetm'
});