/**
 * Model for a JbCostCode
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.jobcosting.JbCostCode', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'jbcostcode_id',
	fields: [
		{ name: 'jbcostcode_id', type: 'int' },
		{ name: 'glaccount_id', type: 'int' },
		{ name: 'jbjobtype_id', type: 'int' },
		{ name: 'jbcostcode_desc', useNull: false },
		{ name: 'jbcostcode_name' },
		{ name: 'jbjobcode_id', type: 'int' },
		{ name: 'jbphasecode_id', type: 'int' },
		{ name: 'jbcostcode_category' },

		// Calculated field that doesn't exist in the DB
		{
			name: 'display_name',
			convert: function(v, rec) {
				return NP.model.jobcosting.JbCostCode.formatName(rec);
			}
		}
	],

	statics: {
		formatName: function(rec) {
			if (!rec.get) {
				rec = Ext.create('NP.model.jobcosting.JbCostCode', rec);
			}
			if (rec.get('jbcostcode_id') === null) {
				return '';
			}

			var val = rec.get('jbcostcode_name') + ' - ';
			if (rec.get('jbcostcode_desc') != '' && rec.get('jbcostcode_desc') !== null) {
				val += rec.get('jbcostcode_desc');
			} else {
				val += 'No Desc.';
			}
			return val;
		}
	}
});