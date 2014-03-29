/**
 * Model for a PoItem
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.po.PoItem', {
	extend: 'Ext.data.Model',
	
	idProperty: 'poitem_id',
	fields: [
		{ name: 'poitem_id', type: 'int' },
		{ name: 'glaccount_id', type: 'int' },
		{ name: 'poitem_description', type: 'string', defaultValue: '' },
		{ name: 'poitem_quantity', type: 'float', defaultValue: 1.0 },
		{ name: 'poitem_unitprice', type: 'float', useNull: false },
		{ name: 'poitem_amount', type: 'float', useNull: false },
		{ name: 'purchaseorder_id', type: 'int' },
		{ name: 'poitem_budgetvariance', type: 'float', useNull: false },
		{ name: 'poitem_created', type: 'date' },
		{ name: 'poitem_salestax', type: 'float', useNull: false },
		{ name: 'poitem_shipping', type: 'float', useNull: false },
		{ name: 'property_id', type: 'int' },
		{ name: 'unit_id', type: 'int' },
		{
			name: 'poitem_taxflag',
			defaultValue: 'N',
			// A null value is treated as an 'N', so let's convert it here
			convert: function(v) {
				 if (v === null || v === '' || v === '0') {
				 	return 'N';
				 }

				 return v;
			} 
		},
		{ name: 'poitem_description_alt' },
		{ name: 'reftable_name' },
		{ name: 'reftablekey_id', type: 'int' },
		{ name: 'poitem_split', type: 'int', defaultValue: 0 },
		{ name: 'poitem_period', type: 'date' },
		{ name: 'poitem_linenum', type: 'int' },
		{ name: 'poitem_jobflag' },
		{ name: 'universal_field1', type: 'string', useNull: false },
		{ name: 'universal_field2', type: 'string', useNull: false },
		{ name: 'universal_field3', type: 'string', useNull: false },
		{ name: 'universal_field4', type: 'string', useNull: false },
		{ name: 'universal_field5', type: 'string', useNull: false },
		{ name: 'universal_field6', type: 'string', useNull: false },
		{ name: 'universal_field7', type: 'string', useNull: false },
		{ name: 'universal_field8', type: 'string', useNull: false },
		{ name: 'poitem_isReceived', type: 'int' },
		{ name: 'poitem_cancel_userprofile_id', type: 'int' },
		{ name: 'poitem_cancel_dt', type: 'date' },
		{ name: 'parent_poitem_id', type: 'int' },
		{ name: 'sysdatetm', type: 'date' },
		{ name: 'dfsplit_id', type: 'int' },
		{ name: 'vcitem_number', type: 'string', useNull: false },
		{ name: 'vcitem_uom', type: 'string', useNull: false },
		{ name: 'is_from_catalog', type: 'int', defaultValue: 0 },
		{ name: 'unittype_material_id', type: 'int' },
		{ name: 'unittype_meas_id', type: 'int' },
		{ name: 'vcorder_aux_part_id' },

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

		{ name: 'invoice_id' },
		{ name: 'invoice_ref' },

		{ name: 'invoiceitem_amount', type: 'float', useNull: false },

		{ name: 'dfsplit_name' },

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
		}
	]
});