/**
 * Grid column for Needed By Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.gridcol.NeededByDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.po.gridcol.neededbydate',

	text     : 'Needed By',
	dataIndex: 'purchaseorder_NeededBy_datetm'
});