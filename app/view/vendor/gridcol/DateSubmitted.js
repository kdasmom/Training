/**
 * @author Baranov A.V.
 * @date 10/2/13
 */

Ext.define('NP.view.vendor.gridcol.DateSubmitted', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.vendor.gridcol.datesubmitted',

	text     : 'Date Submitted',
	dataIndex: 'recauthor_datetm',
	xtype: 'datecolumn'
});