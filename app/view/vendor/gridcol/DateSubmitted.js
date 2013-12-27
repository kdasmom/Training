/**
 * @author Baranov A.V.
 * @date 10/2/13
 */

Ext.define('NP.view.vendor.gridcol.DateSubmitted', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.vendor.gridcol.datesubmitted',

	require: [
		'NP.lib.core.Util'
	],

	text     : 'Date Submitted',
	dataIndex: 'sent_for_approval_date',
	xtype: 'date',
	dateFormat: 'd/m/y',
	renderer: function(val, meta, rec) {
		return Ext.Date.format(rec.get('sent_for_approval_date'), 'm/d/Y');
	}
});