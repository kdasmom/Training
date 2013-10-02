/**
 * Grid column for Date Sent For Approval
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.vendor.gridcol.SentForApprovalDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.vendor.gridcol.sentforapprovaldate',

	text     : 'Date Sent For Approval',
	dataIndex: 'sent_for_approval_date'
});