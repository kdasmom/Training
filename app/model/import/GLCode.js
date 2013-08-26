/**
 * Model for a GLCode
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.import.GLCode', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'GLAccountName' },
		{ name: 'AccountNumber' },
		{ name: 'AccountType' },
		{ name: 'CategoryName' },
		{ name: 'IntegrationPackageName' },
		{ name: 'validation_status' }
	],

	validations: [
		{ field: 'glaccount_name', type: 'length', max: 50 }
	]
});