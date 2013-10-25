/**
 * Model for a GLCode
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.importing.GLCode', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'glaccount_name' },
		{ name: 'glaccount_number' },
		{ name: 'glaccounttype_name' },
		{ name: 'category_name' },
		{ name: 'integration_package_name' },
		{ name: 'validation_status' },
		{ name: 'validation_errors' }
	]
});