/**
 * Model for a Unit
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.import.Unit', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'IntegrationPackage' },
		{ name: 'PropertyCode' },
		{ name: 'Code' },
		{ name: 'Name' },
		{ name: 'Type' },
                { name: 'validation_status' },
	],

	validations: [
		{ field: 'IntegrationPackage', type: 'length', max: 50 },
		{ field: 'PropertyCode', type: 'length', max: 10 },
		{ field: 'Code', type: 'length', max: 10 },
		{ field: 'Name', type: 'length', max: 50 },
		{ field: 'Type', type: 'length', max: 255 },
	]
});