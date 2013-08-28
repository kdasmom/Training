/**
 * Model for a Insurance
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.vendor.Insurance', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config',
		'NP.model.vendor.Vendor',
		'NP.model.vendor.InsuranceType'
	],

	idProperty: 'insurance_id',
	fields: [
		{ name: 'insurance_id', type: 'int' },
		{ name: 'tablekey_id', type: 'int' },
		{ name: 'table_name' },
		{ name: 'insurancetype_id', type: 'int' },
		{ name: 'insurance_company' },
		{ name: 'insurance_policynum' },
		{ name: 'insurance_expdatetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'insurance_status' },
		{ name: 'insurance_policy_effective_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'insurance_policy_limit' },
		{ name: 'insurance_additional_insured_listed' },
		{ name: 'insurance_policyreqthru', type: 'date', dateFormat: NP.Config.getServerDateFormat() },

		// These fields are not database columns
		{ name: 'days_to_expiration', type: 'int' }
	],

    belongsTo: [
        {
			model     : 'NP.model.vendor.Vendor',
			name      : 'vendor',
			getterName: 'getVendor',
			foreignKey: 'tablekey_id',
			primaryKey: 'vendor_id',
			reader    : 'jsonflat'
        },{
			model     : 'NP.model.vendor.InsuranceType',
			name      : 'insuranceType',
			getterName: 'getInsuranceType',
			foreignKey: 'insurancetype_id',
			primaryKey: 'insurancetype_id',
			reader    : 'jsonflat'
        }
    ]
});