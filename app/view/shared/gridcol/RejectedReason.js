/**
 * Grid column for Rejection Reason
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.RejectedReason', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.rejectedreason',

	text     : 'Rejection Reason',
	dataIndex: 'rejected_reason'
});