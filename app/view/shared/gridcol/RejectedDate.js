/**
 * Grid column for Rejected Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.RejectedDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.shared.gridcol.rejecteddate',

	text     : 'Rejected Date',
	dataIndex: 'rejected_datetm'
});