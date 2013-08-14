/**
 * Model for a GLBudget
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.import.GLActual', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'BusinessUnit' },
		{ name: 'GLAccount' },
		{ name: 'PeriodMonth' },
		{ name: 'PeriodYear' },
		{ name: 'Amount' },
		{ name: 'IntegrationPackage' },
		{ name: 'validation_status' }
	],

	validations: [
		{ field: 'GLAccount', type: 'presence' },
	]
});