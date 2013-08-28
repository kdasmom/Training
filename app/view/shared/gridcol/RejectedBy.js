/**
 * Grid column for Invoice Rejected By
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.RejectedBy', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.rejectedby',

	text     : 'Rejected By',
	dataIndex: 'rejected_by'
});