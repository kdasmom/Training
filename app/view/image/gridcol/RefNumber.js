Ext.define('NP.view.image.gridcol.RefNumber', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.image.gridcol.refnumber',

	text     : 'Reference',
	dataIndex: 'ref_number',
	renderer : function(val, meta, rec) {
		return rec.getDocType().get('ref_number');
	}
});