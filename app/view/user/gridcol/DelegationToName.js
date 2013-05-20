/**
 * Grid column for Delegation To Name
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.gridcol.DelegationToName', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.user.gridcol.delegationtoname',

	text     : 'Name',
	dataIndex: 'delegation_to_userprofile_username',
	renderer : function(val, meta, rec) {
		return rec.get('delegation_to_person_lastname') + ', ' + rec.get('delegation_to_person_firstname') + ' (' + val + ')';
	}
});