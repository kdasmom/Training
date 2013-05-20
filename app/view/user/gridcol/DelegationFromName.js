/**
 * Grid column for Delegation From Name
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.gridcol.DelegationFromName', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.user.gridcol.delegationfromname',

	text     : 'Name',
	dataIndex: 'userprofile_username',
	renderer : function(val, meta, rec) {
		return rec.get('person_lastname') + ', ' + rec.get('person_firstname') + ' (' + val + ')';
	}
});