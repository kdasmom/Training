/**
 * Model for a GlImportAccount
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.gl.GlImportAccount', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	fields: [
		{ name: 'glaccount_name' },
		{ name: 'glaccount_number' },
		{ name: 'account_type_name' },
		{ name: 'category_name' },
		{ name: 'integration_package_name' },
                { name: 'validation_status' },
                { name: 'validation_messages' }
	],

	validations: [
		{ field: 'glaccount_name', type: 'length', max: 50 }
	]
});