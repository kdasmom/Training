/**
 * Model for a Insurance
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.vendor.Insurance', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config'
	],

	idProperty: 'insurance_id',
	fields: [
		{ name: 'insurance_id', type: 'int' },
		{ name: 'tablekey_id', type: 'int' },
		{ name: 'table_name' },
		{ name: 'insurancetype_id', type: 'int' },
		{ name: 'insurance_company' },
		{ name: 'insurance_policynum' },
		{ name: 'insurance_expdatetm', type: 'date' },
		{ name: 'insurance_status' },
		{ name: 'insurance_policy_effective_datetm', type: 'date' },
		{ name: 'insurance_policy_limit' },
		{ name: 'insurance_additional_insured_listed' },
		{ name: 'insurance_properties_list_id' },
		{ name: 'insurance_policyreqthru', type: 'date' },

		// These fields are not database columns
		{ name: 'days_to_expiration', type: 'int' },

		{ name: 'vendor_id', type: 'int' },
		{ name: 'vendor_id_alt' },
		{ name: 'vendor_name' },

		{ name: 'integration_package_name' },

		{ name: 'insurancetype_name' }
	]
});