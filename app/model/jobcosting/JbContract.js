/**
 * Model for a JbContract
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.jobcosting.JbContract', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'jbcontract_id',
	fields: [
		{ name: 'jbcontract_id', type: 'int' },
		{ name: 'jbcontract_default_retention' },
		{ name: 'jbcontract_name' },
		{ name: 'jbcontract_desc', useNull: false },
		{ name: 'vendorsite_id', type: 'int' },
		{ name: 'jbcontract_status' },
		{ name: 'create_datetm', type: 'date' },

		// Calculated field that doesn't exist in the DB
		{
			name: 'display_name',
			convert: function(v, rec) {
				return NP.model.jobcosting.JbContract.formatName(rec);
			}
		}
	],

	statics: {
		formatName: function(rec) {
			if (rec.get('jbcontract_id') === null) {
				return '';
			}

			var val = rec.get('jbcontract_name') + ' - ';
			if (rec.get('jbcontract_desc') != '') {
				val += rec.get('jbcontract_desc');
			} else {
				val += 'No Desc.';
			}
			return val;
		}
	}
});