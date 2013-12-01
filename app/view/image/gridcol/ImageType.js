/**
 * Grid column for Image Doc Type
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.image.gridcol.ImageType', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.image.gridcol.imagetype',

	text     : 'Image Type',
	dataIndex: 'image_doctype_name',
	renderer : function(val, meta, rec) {
		return rec.getDocType().get('image_doctype_name');
	}
});