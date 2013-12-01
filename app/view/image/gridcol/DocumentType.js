/**
 * Grid column for Image Doc Type
 */
Ext.define('NP.view.image.gridcol.DocumentType', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.image.gridcol.documenttype',

	text     : 'Document Type',
	dataIndex: 'image_doctype_name',
	renderer : function(val, meta, rec) {
		return rec.getDocType().get('image_doctype_name');
	}
});