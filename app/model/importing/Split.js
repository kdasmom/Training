/**
 * Model for a Splits
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.importing.Split', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'integration_package_name' },
		{ name: 'dfsplit_name' },
		{ name: 'vendor_id_alt' },
		{ name: 'property_id_alt' },
		{ name: 'glaccount_number' },
		{ name: 'unit_id_alt' },
		{ name: 'universal_field1' },
		{ name: 'universal_field2' },
        { name: 'universal_field3' },
		{ name: 'universal_field4' },
		{ name: 'universal_field5' },
		{ name: 'universal_field6' },
        { name: 'dfsplititem_percent' },
        { name: 'validation_status' },
        { name: 'validation_errors' }
	]
});