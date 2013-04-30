/**
 * Grid column for catalog item unit of measurement
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalog.gridcol.VcItemUom', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.catalog.gridcol.vcitemuom',

	text     : 'Unit of Measurement',
	dataIndex: 'vcitem_uom'
});