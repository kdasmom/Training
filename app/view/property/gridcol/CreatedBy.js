/**
 * Grid column for Created By
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.gridcol.CreatedBy', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.property.gridcol.createdby',

	text: 'Created By',
	dataIndex: 'created_by_userprofile_username',
	renderer: function(val, meta, rec) {
		var returnVal = val;
		var firstName = rec.get('created_by_person_firstname');
		var lastName = rec.get('created_by_person_lastname');
		if (rec.get('created_by_person_id') != null && (firstName != '' || lastName != '')) {
			returnVal += ' (' + firstName + ' ' + lastName + ')'
		}

		return returnVal;
	}
});