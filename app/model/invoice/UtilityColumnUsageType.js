/**
 * Model for a UtilityColumnUsageType
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.invoice.UtilityColumnUsageType', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'UtilityColumn_UsageType_Id',
	fields: [
		{ name: 'UtilityColumn_UsageType_Id', type: 'int' },
		{ name: 'UtilityType_Id', type: 'int' },
		{ name: 'UtilityColumn_UsageType_Set_Id', type: 'int' },
		{ name: 'UtilityColumn_UsageType_Name' },
		{ name: 'UtilityColumn_UsageType_Multiplier' },
		{ name: 'UtilityColumn_UsageType_Multiplier_To_Id', type: 'int' }
	]
});