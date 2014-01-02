/**
 * Model for a UserMessage
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.system.UserMessage', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config'
	],

	idProperty: 'id',
	fields: [
		{ name: 'id', type: 'int' },
		{ name: 'type', defaultValue: 'email' },
		{ name: 'status', defaultValue: 'scheduled' },
		{ name: 'subject' },
		{ name: 'body' },
		{ name: 'createdBy', type: 'int' },
		{ name: 'createdAt', type: 'date' },
		{ name: 'sentAt', type: 'date' },
		{ name: 'displayUntil', type: 'date' },

		// These fields are not DB columns
		{ name: 'person_firstname'},
		{ name: 'person_lastname' },

		{ name: 'userprofile_username' }
	],

	validations: [
		{ field: 'type', type: 'length', max: 10 },
		{ field: 'status', type: 'length', max: 10 },
		{ field: 'subject', type: 'length', max: 100 },
		{ field: 'body', type: 'length', max: 6000 }
	]
});