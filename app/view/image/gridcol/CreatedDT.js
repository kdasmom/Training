Ext.define('NP.view.image.gridcol.CreatedDT', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.image.gridcol.createddt',

	text     : 'Date',
	dataIndex: 'create_dt',
	renderer : function(val, meta, rec) {
		return rec.getDocType().get('create_dt');
	}
});