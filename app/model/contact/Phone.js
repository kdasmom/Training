/**
 * Model for a Phone
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.contact.Phone', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'phone_id',
	fields: [
		{ name: 'phone_id', type: 'int' },
		{ name: 'phonetype_id', type: 'int' },
		{ name: 'tablekey_id', type: 'int' },
		{ name: 'table_name' },
		{ name: 'phone_number' },
		{ name: 'phone_ext' },
		{ name: 'phone_countrycode' }
	],

	validations: [
		{ field: 'table_name', type: 'length', max: 100 },
		{ field: 'phone_number', type: 'length', max: 25 },
		{ field: 'phone_ext', type: 'length', max: 25 },
		{ field: 'phone_countrycode', type: 'length', max: 25 }
	]
});