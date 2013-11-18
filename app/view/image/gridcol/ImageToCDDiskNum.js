Ext.define('NP.view.image.gridcol.ImageToCDDiskNum', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.image.gridcol.imagetocddisknum',

	text     : 'CD',
	dataIndex: 'ImageToCD_diskNum',
	renderer : function(val, meta, rec) {
		return rec.getDocType().get('ImageToCD_diskNum');
	}
});