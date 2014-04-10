/**
 * Grid column for Image Source
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.image.gridcol.Source', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.image.gridcol.source',

	text     : 'Source',
	dataIndex: 'invoiceimage_source_name'
});