/**
 * Grid column for Image Scan Date
 */
Ext.define('NP.view.image.gridcol.DeleteDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.image.gridcol.deletedate',

	text     : 'Deleted Date',
	dataIndex: 'image_index_deleted_datetm'
});