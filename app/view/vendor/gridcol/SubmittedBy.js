/**
 * @author Baranov A.V.
 * @date 10/2/13
 */


Ext.define('NP.view.vendor.gridcol.SubmittedBy', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.vendor.gridcol.submittedby',

	text     : 'Submitted By',
	dataIndex: 'PersonName',
	renderer: function(val, meta, rec) {
		return rec.raw['PersonName'];
	}
});