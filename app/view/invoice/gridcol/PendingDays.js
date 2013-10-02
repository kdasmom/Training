/**
 * Grid column for Invoice Pending Days
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.PendingDays', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.invoice.gridcol.pendingdays',

	text     : 'Days Pending',
	dataIndex: 'invoice_pending_days',
	align    : 'right'
});