/**
 * Model for a GLCategory
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.importing.GLCategory', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'glaccount_name' },
		{ name: 'integration_package_name' },
		{ name: 'validation_status' },
		{ name: 'validation_errors' }
	]
});