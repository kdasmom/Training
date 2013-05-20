/**
 * Grid column for Delegation Start Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.gridcol.DelegationStartDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.user.gridcol.delegationstartdate',

	text     : 'Start Date',
	dataIndex: 'delegation_startdate'
});