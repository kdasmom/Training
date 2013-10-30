/**
 * Model for a UtilityAccount
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.invoice.UtilityAccount', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'UtilityAccount_Id',
	fields: [
		{ name: 'UtilityAccount_Id', type: 'int' },
		{ name: 'Utility_Id', type: 'int' },
		{ name: 'UtilityAccount_Units', type: 'int' },
		{ name: 'UtilityAccount_Bedrooms', type: 'int' },
		{ name: 'UtilityAccount_MeterSize' },
		{ name: 'UtilityAccount_AccountNumber' },
		{ name: 'property_id', type: 'int' },
		{ name: 'utilityaccount_Building' },
		{ name: 'utilityaccount_active' },
		{ name: 'glaccount_id', type: 'int' },
		{ name: 'unit_id', type: 'int' }
	]
});