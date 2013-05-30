/**
 * Model for a Address
 *
 * @author 
 */
Ext.define('NP.model.contact.Address', {
	extend: 'NP.lib.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'address_id',
	fields: [
		{ name: 'address_id', type: 'int' },
		{ name: 'addresstype_id', type: 'int' },
		{ name: 'tablekey_id', type: 'int' },
		{ name: 'table_name' },
		{ name: 'address_attn' },
		{ name: 'address_company' },
		{ name: 'address_line1' },
		{ name: 'address_line2' },
		{ name: 'address_line3' },
		{ name: 'address_city' },
		{ name: 'address_state' },
		{ name: 'address_zip' },
		{ name: 'address_zipext' },
		{ name: 'address_country', type: 'int' },
		{ name: 'address_id_alt' }
	],

	validations: [
		{ field: 'address_id', type: 'presence' },
		{ field: 'table_name', type: 'length', max: 100 },
		{ field: 'address_attn', type: 'length', max: 255 },
		{ field: 'address_company', type: 'length', max: 255 },
		{ field: 'address_line1', type: 'length', max: 255 },
		{ field: 'address_line2', type: 'length', max: 255 },
		{ field: 'address_line3', type: 'length', max: 255 },
		{ field: 'address_city', type: 'length', max: 100 },
		{ field: 'address_state', type: 'length', max: 25 },
		{ field: 'address_zip', type: 'format', matcher: /(\d{5})/ },
		{ field: 'address_zipext', type: 'format', matcher: /(\d{4})/ },
		{ field: 'address_country', type: 'length', max: 100 },
		{ field: 'address_id_alt', type: 'length', max: 50 }
	]
});