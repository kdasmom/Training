/**
 * Grid column for Image Scan Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.image.gridcol.ScanDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.image.gridcol.scandate',

	text     : 'Scanned Date',
	dataIndex: 'Image_Index_Date_Entered'
});