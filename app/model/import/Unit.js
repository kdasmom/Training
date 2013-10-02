/**
 * Model for a Unit
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.import.Unit', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'integration_package_name' },
		{ name: 'property_id_alt' },
		{ name: 'unit_id_alt' },
		{ name: 'unit_number' },
		{ name: 'unittype_name' },
        { name: 'validation_status' },
        { name: 'validation_errors' }
	]
});