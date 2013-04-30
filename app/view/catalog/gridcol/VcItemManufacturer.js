/**
 * Grid column for catalog item manufacturer
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalog.gridcol.VcItemManufacturer', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.catalog.gridcol.vcitemmanufacturer',

	text     : 'Manufacturer',
	dataIndex: 'vcitem_manufacturer'
});