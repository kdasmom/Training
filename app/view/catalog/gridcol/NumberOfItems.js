/**
 * Grid column for Number of Items in Catalog
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalog.gridcol.NumberOfItems', {
	extend: 'Ext.grid.column.Number',
	alias: 'widget.catalog.gridcol.numberofitems',

	text     : 'Number of Items', 
	dataIndex: 'vc_total_items',
	format   : '0', 
	align    : 'right'
});