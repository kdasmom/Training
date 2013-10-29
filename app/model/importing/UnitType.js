/**
 * Model for a UnitType
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.importing.UnitType', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'integration_package_name' },
		{ name: 'property_id_alt' },
		{ name: 'unittype_name' },
		{ name: 'unittype_bedrooms' },
		{ name: 'unittype_bathrooms' },
		{ name: 'carpet_yards' },
		{ name: 'vinyl_yards' },
		{ name: 'tile_yards' },
		{ name: 'hardwood_yards' },
		{ name: 'carpet_feet' },
		{ name: 'vinyl_feet' },
		{ name: 'tile_feet' },
		{ name: 'hardwood_feet' },
        { name: 'validation_status' },
        { name: 'validation_errors' }
	]
});