/**
 * Model for a UnitType
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.import.UnitType', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'IntegrationPackage' },
		{ name: 'PropertyCode' },
		{ name: 'Code' },
		{ name: 'Name' },
		{ name: 'Bedrooms' },
		{ name: 'Bathrooms' },
		{ name: 'CarpetYd' },
		{ name: 'VinylYd' },
		{ name: 'TileYd' },
		{ name: 'HarwoodYd' },
		{ name: 'CarpetFt' },
		{ name: 'VinylFt' },
		{ name: 'TileFt' },
		{ name: 'HarwoodFt' },
                { name: 'validation_status' }
	],

	validations: [
		{ field: 'IntegrationPackage', type: 'length', max: 50 },
		{ field: 'PropertyCode', type: 'length', max: 10 },
		{ field: 'Code', type: 'length', max: 10 },
		{ field: 'Bedrooms', type: 'length', max: 10 },
		{ field: 'Bathrooms', type: 'length', max: 10 },
	]
});