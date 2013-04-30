/**
 * Grid column for catalog item number
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalog.gridcol.VcItemNumber', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.catalog.gridcol.vcitemnumber',

	text     : 'Item Number',
	dataIndex: 'vcitem_number'
});