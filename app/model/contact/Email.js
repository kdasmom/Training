/**
 * Model for a Email
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.contact.Email', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'email_id',
	fields: [
		{ name: 'email_id', type: 'int' },
		{ name: 'emailtype_id', type: 'int' },
		{ name: 'tablekey_id', type: 'int' },
		{ name: 'table_name' },
		{ name: 'email_address' }
	],

	validations: [
		{ field: 'table_name', type: 'length', max: 100 },
		{ field: 'email_address', type: 'length', max: 255 },
		{ field: 'email_address', type: 'email' }
	]
});