/**
 * Grid column for Pending Days
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.PendingDays', {
	extend: 'Ext.grid.column.Number',
	alias: 'widget.shared.gridcol.pendingdays',

	text     : 'Days Pending',
	dataIndex: 'pending_days',
	align    : 'right',
	format   : '0,000'
});