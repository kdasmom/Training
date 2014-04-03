/**
 * Model for a InvoiceItem
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.invoice.InvoiceItem', {
	extend: 'Ext.data.Model',

	idProperty: 'invoiceitem_id',
	fields: [
		{ name: 'invoiceitem_id', type: 'int' },
		{ name: 'invoice_id', type: 'int' },
		{ name: 'invoiceitem_linenum', type: 'int' },
		{ name: 'glaccount_id', type: 'int' },
		{ name: 'invoiceitem_description', type: 'string', defaultValue: '' },
		{ name: 'invoiceitem_quantity', type: 'float', defaultValue: 1.0 },
		{ name: 'invoiceitem_unitprice', type: 'float', useNull: false },
		{ name: 'invoiceitem_amount', type: 'float', useNull: false },
		{ name: 'invoiceitem_budgetvariance', type: 'float', useNull: false },
		{ name: 'invoiceitem_created', type: 'date' },
		{ name: 'invoiceitem_salestax', type: 'float', useNull: false },
		{ name: 'invoiceitem_shipping', type: 'float', useNull: false },
		{ name: 'property_id', type: 'int' },
		{ name: 'unit_id', type: 'int' },
		{
			name: 'invoiceitem_taxflag',
			defaultValue: 'N',
			// A null value is treated as an 'N', so let's convert it here
			convert: function(v) {
				 if (v === null || v === '' || v === '0') {
				 	return 'N';
				 }

				 return v;
			} 
		},
		{ name: 'invoiceitem_description_alt' },
		{ name: 'invoiceitem_split', type: 'int', defaultValue: 0 },
		{ name: 'invoiceitem_period', type: 'date' },
		{ name: 'utilityaccount_id', type: 'int' },
		{ name: 'utilitycolumn_id', type: 'int' },
		{ name: 'utilitycolumn_usagetype_id', type: 'int' },
		{ name: 'vendorsite_id', type: 'int' },
		{ name: 'invoiceitem_jobflag' },
		{ name: 'universal_field1', type: 'string', useNull: false },
		{ name: 'universal_field2', type: 'string', useNull: false },
		{ name: 'universal_field3', type: 'string', useNull: false },
		{ name: 'universal_field4', type: 'string', useNull: false },
		{ name: 'universal_field5', type: 'string', useNull: false },
		{ name: 'universal_field6', type: 'string', useNull: false },
		{ name: 'universal_field7', type: 'string', useNull: false },
		{ name: 'universal_field8', type: 'string', useNull: false },
		{ name: 'dfsplit_id', type: 'int' },
		{ name: 'vcitem_number', type: 'string', useNull: false },
		{ name: 'vcitem_uom', type: 'string', useNull: false },
		{ name: 'is_from_catalog', type: 'int', defaultValue: 0 },
		{ name: 'unittype_material_id', type: 'int' },
		{ name: 'unittype_meas_id', type: 'int' },
		{ name: 'reftable_name' },
		{ name: 'reftablekey_id', type: 'int' },
		{ name: 'invoiceitem_quantity_long', type: 'float' },
		{ name: 'invoiceitem_unitprice_long', type: 'float' },

		// These fields are not database columns
		{ name: 'property_id_alt' },
		{ name: 'property_name' },

		{ name: 'glaccount_number' },
		{ name: 'glaccount_name' },

		{ name: 'unit_id_alt' },
		{ name: 'unit_number' },

		{ name: 'jbcontractbudget_id', type: 'int' },
		{ name: 'jbcontractbudget_amt', type: 'float', useNull: false },
		{ name: 'jbcontractbudget_amt_actual', type: 'float', useNull: false },
		{ name: 'jbcontractbudget_amt_pnactual', type: 'float', useNull: false },

		{ name: 'jbassociation_retamt', type: 'float', useNull: false },

		{ name: 'budget_amount', type: 'float', useNull: false },
		{ name: 'budget_variance', type: 'float', useNull: false },

		{ name: 'purchaseorder_id' },
		{ name: 'purchaseorder_ref' },

		{ name: 'poitem_amount', type: 'float', useNull: false },

		{ name: 'dfsplit_name' },

		{ name: 'unittype_material_name' },

		{ name: 'UtilityType_Id', type: 'int' },
		{ name: 'UtilityType' },

		{ name: 'UtilityAccount_AccountNumber' },
		{ name: 'UtilityAccount_MeterSize' },

		{ name: 'UtilityColumn_UsageType_Name' },

		{
			name: 'jbcontract_id',
			type: 'int',
			convert: function(v) {
				if (v === null || v === 0 || v === '') {
					return null;
				}

				return parseInt(v);
			}
		},
		{ name: 'jbcontract_name' },
		{ name: 'jbcontract_desc' },

		{
			name: 'jbchangeorder_id',
			type: 'int',
			convert: function(v) {
				if (v === null || v === 0 || v === '') {
					return null;
				}

				return parseInt(v);
			}
		},

		{ name: 'jbchangeorder_name' },
		{ name: 'jbchangeorder_desc' },

		{
			name: 'jbjobcode_id',
			type: 'int',
			convert: function(v) {
				if (v === null || v === 0 || v === '') {
					return null;
				}

				return parseInt(v);
			}
		},
		{ name: 'jbjobcode_name' },
		{ name: 'jbjobcode_desc' },

		{
			name: 'jbphasecode_id',
			type: 'int',
			convert: function(v) {
				if (v === null || v === 0 || v === '') {
					return null;
				}

				return parseInt(v);
			}
		},
		{ name: 'jbphasecode_name' },
		{ name: 'jbphasecode_desc' },

		{
			name: 'jbcostcode_id',
			type: 'int',
			convert: function(v) {
				if (v === null || v === 0 || v === '') {
					return null;
				}

				return parseInt(v);
			}
		},
		{ name: 'jbcostcode_name' },
		{ name: 'jbcostcode_desc' },
		
		{
			name        : 'split_percentage',
			type        : 'float',
			persist     : false,
			useNull     : false,
			defaultValue: 0
		},

		{
			name: 'is_utility',
			type: 'int',
			convert: function(v, rec) {
				if (v === null) {
					v = 0;
					if (rec.get('utilityaccount_id') !== null) {
						v = 1;
					}
				}
				return v;
			}
		}
	]
});