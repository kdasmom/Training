/**
 * Grid column for Image Doc Type
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.image.gridcol.DocType', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.image.gridcol.doctype',

	text     : 'Doc Type',
	dataIndex: 'image_doctype_name',
	renderer : function(val, meta, rec) {
		return rec.getDocType().get('image_doctype_name');
	}
});