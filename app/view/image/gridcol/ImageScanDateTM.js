Ext.define('NP.view.image.gridcol.ImageScanDateTM', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.image.gridcol.imagescandatetm',

	text     : 'Date',
	dataIndex: 'image_scan_datetm',
	renderer : function(val, meta, rec) {
		return rec.getDocType().get('image_scan_datetm');
	}
});