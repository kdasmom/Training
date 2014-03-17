/**
 * Created by rnixx on 11/6/13.
 */

Ext.define('NP.view.image.gridcol.ImageStatus', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.image.gridcol.imagestatus',

	text     : 'Image status',
	dataIndex: 'Image_Index_Status',

	renderer: function(val, meta, rec) {
		switch(val) {
			case 0:
				return 'Scanned';
				break;
			case 1:
				return 'Ready To Convert';
				break;
			case -1:
				return 'Deleted';
				break;
			case 2:
				return 'Assigned';
				break;
		}
	}
});