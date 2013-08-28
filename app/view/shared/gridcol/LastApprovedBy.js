/**
 * Grid column for Entity Last Aproved By
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.LastApprovedBy', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.lastapprovedby',

	text     : 'Last Approved By',
	dataIndex: 'last_approved_by'
});