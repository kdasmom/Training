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
		/*'NP.model.jobcosting.JbContract',
		'NP.model.jobcosting.JbChangeOrder',
		'NP.model.jobcosting.JbJobCode',
		'NP.model.jobcosting.JbCostCode',
		'NP.model.jobcosting.JbPhaseCode'*/
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
		{ name: 'budget_variance', type: 'float', useNull: false },
		{ name: 'purchaseorder_id' },
		{ name: 'purchaseorder_ref' },
		{ name: 'poitem_amount', type: 'float', useNull: false }

		// TODO: determine if this is needed for optimization */
		/*{ name: 'property_id', type: 'int' },
		{ name: 'property_id_alt' },
		{ name: 'property_name' },

		{ name: 'glaccount_id', type: 'int' },
		{ name: 'glaccount_number' },
		{ name: 'glaccount_name' },

		{ name: 'unit_id', type: 'int' },
		{ name: 'unit_id_alt' },
		{ name: 'unit_number' },

		{ name: 'jbcontractbudget_id', type: 'int' },
		{ name: 'jbcontractbudget_amt', type: 'float', useNull: false },
		{ name: 'jbcontractbudget_amt_actual', type: 'float', useNull: false },
		{ name: 'jbcontractbudget_amt_pnactual', type: 'float', useNull: false },

		{ name: 'budget_amount', type: 'float', useNull: false },
		{ name: 'budget_variance', type: 'float', useNull: false },

		{ name: 'purchaseorder_id' },
		{ name: 'purchaseorder_ref' },
		{ name: 'poitem_amount', type: 'float', useNull: false },

		{ name: 'UtilityColumn_UsageType_Name' },

		{ name: 'UtilityAccount_AccountNumber' },
		{ name: 'UtilityAccount_MeterSize' },

		{ name: 'unittype_material_name' },

		{ name: 'dfsplit_name' },

		{ name: 'jbcontract_id', type: 'int' },
		{ name: 'jbcontract_name' },
		{ name: 'jbcontract_desc' },
		{ name: 'jbcontract_display', convert: function(v, rec) { NP.model.jobcosting.JbContract.formatName(rec); }},

		{ name: 'jbchangeorder_id', type: 'int' },
		{ name: 'jbchangeorder_name' },
		{ name: 'jbchangeorder_desc' },
		{ name: 'jbchangeorder_display', convert: function(v, rec) { NP.model.jobcosting.JbChangeOrder.formatName(rec); }},

		{ name: 'jbjobcode_id', type: 'int' },
		{ name: 'jbjobcode_name' },
		{ name: 'jbjobcode_desc' },
		{ name: 'jbjobcode_display', convert: function(v, rec) { NP.model.jobcosting.JbJobCode.formatName(rec); }},

		{ name: 'jbcostcode_id', type: 'int' },
		{ name: 'jbcostcode_name' },
		{ name: 'jbcostcode_desc' },
		{ name: 'jbcostcode_display', convert: function(v, rec) { NP.model.jobcosting.JbCostCode.formatName(rec); }},

		{ name: 'jbphasecode_id', type: 'int' },
		{ name: 'jbphasecode_name' },
		{ name: 'jbphasecode_desc' },
		{ name: 'jbphasecode_display', convert: function(v, rec) { NP.model.jobcosting.JbPhaseCode.formatName(rec); }},

		{ name: 'jbassociation_retamt', type: 'float', useNull: false }*/
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