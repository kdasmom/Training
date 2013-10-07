/**
 * Model for a Person
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.contact.Person', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'person_id',
	fields: [
		{ name: 'person_id', type: 'int' },
		{ name: 'asp_client_id', type: 'int' },
		{ name: 'person_title' },
		{ name: 'person_firstname' },
		{ name: 'person_middlename' },
		{ name: 'person_lastname' },
		{ name: 'person_suffix' },
		{ name: 'person_ssn' },
		{ name: 'person_gender' },
		{ name: 'person_birthdate', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
		{ name: 'personmarital_id', type: 'int' },
		{ name: 'person_passport_no' }
	]
});