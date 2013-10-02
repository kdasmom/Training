/**
 * Grid column for Invoice Period
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.gridcol.Period', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.po.gridcol.period',

	text     : 'Period',
	dataIndex: 'purchaseorder_period',
	format   : 'm/Y'
});