/**
 * Model for a Unit
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.property.Unit', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config'
	],

	idProperty: 'unit_id',
	fields: [
		{ name: 'unit_id', type: 'int' },
		{ name: 'unit_id_alt' },
		{ name: 'building_id', type: 'int' },
		{ name: 'unittype_id', type: 'int' },
		{ name: 'unit_number' },
		{ name: 'unit_status' },
		{ name: 'unit_dateavail', type: 'date' },
		{ name: 'unit_squarefeet' },
		{ name: 'property_id', type: 'int' },

		// These fields are not DB columns in the UNIT table
		{ name: 'unittype_name' }
	],

	validations: [
		{ field: 'unit_id_alt', type: 'length', max: 10 },
		{ field: 'unit_number', type: 'length', max: 50 },
		{ field: 'unit_status', type: 'length', max: 50 }
	]
});