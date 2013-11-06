/**
 * Model for a GLBudget
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.importing.GLBudget', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'property_id_alt' },
		{ name: 'glaccount_number' },
		{ name: 'period_month' },
		{ name: 'glaccountyear_year' },
		{ name: 'amount' },
		{ name: 'integration_package_name' },
		{ name: 'validation_status' },
		{ name: 'validation_errors' }
	]
});