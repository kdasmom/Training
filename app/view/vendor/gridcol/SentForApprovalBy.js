/**
 * Grid column for Sent For Approval By
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.vendor.gridcol.SentForApprovalBy', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.vendor.gridcol.sentforapprovalby',

	text     : 'Sent From',
	dataIndex: 'sent_for_approval_by'
});