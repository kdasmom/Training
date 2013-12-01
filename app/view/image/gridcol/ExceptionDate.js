/**
 * Grid column for Image Exception Date
 */
Ext.define('NP.view.image.gridcol.ExceptionDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.image.gridcol.exceptiondate',

	text     : 'Exception Date',
	dataIndex: 'Image_Index_Exception_datetm'
});