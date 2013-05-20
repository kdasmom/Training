/**
 * Grid column for Delegation Created By
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.gridcol.DelegationCreatedBy', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.user.gridcol.delegationcreatedby',

	text     : 'Setup By',
	dataIndex: 'delegation_createdby_userprofile_username',
	renderer : function(val, meta, rec) {
		if (rec.get('delegation_createdby') !== null) {
			return rec.get('delegation_createdby_person_lastname') + ', ' + rec.get('delegation_createdby_person_firstname') + ' (' + val + ')';
		} else {
			return '';
		}
	}
});