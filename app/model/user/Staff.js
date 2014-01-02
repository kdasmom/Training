/**
 * Model for a Staff
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.user.Staff', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.model.contact.Person',
        'NP.lib.data.JsonFlat'
	],

	idProperty: 'staff_id',
	fields: [
		{ name: 'staff_id', type: 'int' },
		{ name: 'staff_id_alt' },
		{ name: 'person_id', type: 'int' },
		{ name: 'staff_status', defaultValue: 'active' }
	]
});