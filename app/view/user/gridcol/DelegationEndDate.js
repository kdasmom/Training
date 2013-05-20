/**
 * Grid column for Delegation Start Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.gridcol.DelegationEndDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.user.gridcol.delegationenddate',

	text     : 'End Date',
	dataIndex: 'Delegation_StopDate'
});