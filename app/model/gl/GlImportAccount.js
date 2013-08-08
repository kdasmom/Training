/**
 * Model for a GlImportAccount
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.gl.GlImportAccount', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	fields: [
		{ name: 'GL Account Name' },
		{ name: 'AccountNumber' },
		{ name: 'AccountType' },
		{ name: 'CategoryName' },
		{ name: 'IntegrationPackageName' },
                { name: 'validation_status' },
                { name: 'validation_messages' }
	],

	validations: [
		{ field: 'glaccount_name', type: 'length', max: 50 }
	]
});