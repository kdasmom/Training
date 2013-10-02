/**
 * Model for a PropertyGL
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.import.PropertyGL', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'property_id_alt' },
		{ name: 'glaccount_number' },
		{ name: 'integration_package_name' },
        { name: 'validation_status' },
        { name: 'validation_errors' }
	]
});