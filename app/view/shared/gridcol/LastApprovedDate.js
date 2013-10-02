/**
 * Grid column for Entity Last Approved Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.LastApprovedDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.shared.gridcol.lastapproveddate',

	text     : 'Last Approved Date',
	dataIndex: 'last_approved_datetm'
});