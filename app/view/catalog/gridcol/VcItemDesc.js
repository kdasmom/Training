/**
 * Grid column for catalog item description
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalog.gridcol.VcItemDesc', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.catalog.gridcol.vcitemdesc',

	text     : 'Description',
	dataIndex: 'vcitem_desc'
});