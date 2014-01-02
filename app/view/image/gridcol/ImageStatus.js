/**
 * Created by rnixx on 11/6/13.
 */

Ext.define('NP.view.image.gridcol.ImageStatus', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.image.gridcol.imagestatus',

	text     : 'Image status',
	dataIndex: 'image_index_status',

	renderer: function(val, meta, rec) {
		return val;
	}
});