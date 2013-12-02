/**
 * Model for a JbChangeOrder
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.jobcosting.JbChangeOrder', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'jbchangeorder_id',
	fields: [
		{ name: 'jbchangeorder_id', type: 'int' },
		{ name: 'jbchangeorder_name' },
		{ name: 'jbchangeorder_desc', useNull: false },

		// Calculated field that doesn't exist in the DB
		{
			name: 'display_name',
			convert: function(v, rec) {
				return NP.model.jobcosting.JbChangeOrder.formatName(rec);
			}
		}
	],

	statics: {
		formatName: function(rec) {
			if (rec.get('jbchangeorder_id') === null) {
				return '';
			}

			var val = rec.get('jbchangeorder_name') + ' - ';
			if (rec.get('jbchangeorder_desc') != '' && rec.get('jbchangeorder_desc') !== null) {
				val += rec.get('jbchangeorder_desc');
			} else {
				val += 'No Desc.';
			}
			return val;
		}
	}
});