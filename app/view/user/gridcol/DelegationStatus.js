/**
 * Grid column for Delegation Status
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.gridcol.DelegationStatus', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.user.gridcol.delegationstatus',

	text     : 'Status',
	dataIndex: 'delegation_status_name'
});