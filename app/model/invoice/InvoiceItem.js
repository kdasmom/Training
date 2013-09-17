/**
 * Model for a InvoiceItem
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.invoice.InvoiceItem', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config',
		'NP.model.gl.GlAccount',
		'NP.model.property.Property',
		'NP.model.invoice.UtilityColumnUsageType',
		'NP.model.invoice.UtilityAccount',
		'NP.model.invoice.UnitTypeMaterial',
		'NP.model.property.Unit',
		'NP.model.system.DfSplit',
		'NP.model.jobcosting.JbJobAssociation',
		'NP.model.jobcosting.JbContractBudget'
	],

	idProperty: 'invoiceitem_id',
	fields: [
		{ name: 'invoiceitem_id', type: 'int' },
		{ name: 'invoice_id', type: 'int' },
		{ name: 'invoiceitem_linenum' },
		{ name: 'glaccount_id', type: 'int' },
		{ name: 'invoiceitem_description' },
		{ name: 'invoiceitem_quantity' },
		{ name: 'invoiceitem_unitprice' },
		{ name: 'invoiceitem_amount', type: 'float', useNull: false },
		{ name: 'invoiceitem_budgetvariance' },
		{ name: 'invoiceitem_created', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'invoiceitem_salestax', type: 'float', useNull: false },
		{ name: 'invoiceitem_shipping', type: 'float', useNull: false },
		{ name: 'property_id', type: 'int' },
		{ name: 'unit_id', type: 'int' },
		{ name: 'invoiceitem_taxflag', defaultValue: 'N' },
		{ name: 'invoiceitem_description_alt' },
		{ name: 'invoiceitem_split', type: 'int', defaultValue: 0 },
		{ name: 'invoiceitem_period', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'utilityaccount_id', type: 'int' },
		{ name: 'utilitycolumn_id', type: 'int' },
		{ name: 'utilitycolumn_usagetype_id', type: 'int' },
		{ name: 'vendorsite_id', type: 'int' },
		{ name: 'invoiceitem_jobflag' },
		{ name: 'universal_field1' },
		{ name: 'universal_field2' },
		{ name: 'universal_field3' },
		{ name: 'universal_field4' },
		{ name: 'universal_field5' },
		{ name: 'universal_field6' },
		{ name: 'dfsplit_id', type: 'int' },
		{ name: 'vcitem_number' },
		{ name: 'vcitem_uom' },
		{ name: 'universal_field7' },
		{ name: 'universal_field8' },
		{ name: 'is_from_catalog' },
		{ name: 'unittype_material_id', type: 'int' },
		{ name: 'unittype_meas_id', type: 'int' },
		{ name: 'reftable_name' },
		{ name: 'reftablekey_id', type: 'int' },
		{ name: 'invoiceitem_quantity_long' },
		{ name: 'invoiceitem_unitprice_long' },

		// These fields are not database columns
		{ name: 'jbcontractbudget_id', type: 'int' },
		{ name: 'jbcontractbudget_amt', type: 'float', useNull: false },
		{ name: 'jbcontractbudget_amt_actual', type: 'float', useNull: false },
		{ name: 'jbcontractbudget_amt_pnactual', type: 'float', useNull: false },
		{ name: 'budget_amount', type: 'float', useNull: false },
		{ name: 'budget_variance', type: 'float', useNull: false }
	],

    belongsTo: [
        {
			model     : 'NP.model.gl.GlAccount',
			name      : 'glaccount',
			getterName: 'getGlAccount',
			foreignKey: 'glaccount_id',
			primaryKey: 'glaccount_id',
			reader    : 'jsonflat'
        },{
			model     : 'NP.model.property.Property',
			name      : 'property',
			getterName: 'getProperty',
			foreignKey: 'property_id',
			primaryKey: 'property_id',
			reader    : 'jsonflat'
        },{
        	model     : 'NP.model.invoice.UtilityColumnUsageType',
			name      : 'usageType',
			getterName: 'getUsageType',
			foreignKey: 'utilitycolumn_usagetype_id',
			primaryKey: 'UtilityColumn_UsageType_Id',
			reader    : 'jsonflat'
        },{
        	model     : 'NP.model.invoice.UtilityAccount',
        	name      : 'utilityAccount',
			getterName: 'getUtilityAccount',
			foreignKey: 'utilityaccount_id',
			primaryKey: 'UtilityAccount_Id',
			reader    : 'jsonflat'
        },{
        	model     : 'NP.model.invoice.UnitTypeMaterial',
        	name      : 'material',
			getterName: 'getMaterial',
			foreignKey: 'unittype_material_id',
			primaryKey: 'unittype_material_id',
			reader    : 'jsonflat'
        },{
        	model     : 'NP.model.property.Unit',
        	name      : 'unit',
			getterName: 'getUnit',
			foreignKey: 'unit_id',
			primaryKey: 'unit_id',
			reader    : 'jsonflat'
        },{
        	model     : 'NP.model.system.DfSplit',
        	name      : 'split',
			getterName: 'getSplit',
			foreignKey: 'dfsplit_id',
			primaryKey: 'dfsplit_id',
			reader    : 'jsonflat'
        }
    ],

    hasOne: [
        {
            model     : 'NP.model.jobcosting.JbJobAssociation',
            name      : 'job',
            getterName: 'getJob',
            foreignKey: 'tablekey_id',
            primaryKey: 'invoiceitem_id',
            reader    : 'jsonflat'
        },{
            model     : 'NP.model.jobcosting.JbContractBudget',
            name      : 'contractBudget',
            getterName: 'getContractBudget',
            foreignKey: 'jbcontractbudget_id',
            primaryKey: 'jbcontractbudget_id',
            reader    : 'jsonflat'
        }
    ]
});