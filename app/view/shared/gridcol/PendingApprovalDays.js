/**
 * Grid column for Pending Approval Days
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.PendingApprovalDays', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.pendingapprovaldays',

	text     : 'Days Pending Approval',
	dataIndex: 'pending_approval_days',
	align    : 'right'
});