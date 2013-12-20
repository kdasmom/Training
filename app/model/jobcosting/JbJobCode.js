/**
 * Model for a JbJobCode
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.jobcosting.JbJobCode', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'jbjobcode_id',
	fields: [
		{ name: 'jbjobcode_id', type: 'int' },
		{ name: 'jbjobcode_desc', useNull: false },
		{ name: 'jbjobtype_id', type: 'int' },
		{ name: 'create_datetm', type: 'date' },
		{ name: 'jbjobcode_name' },
		{ name: 'property_id', type: 'int' },
		{ name: 'jbjobcode_status' },
		{ name: 'glaccount_id', type: 'int' },

		// Calculated field that doesn't exist in the DB
		{
			name: 'display_name',
			convert: function(v, rec) {
				return NP.model.jobcosting.JbJobCode.formatName(rec);
			}
		}
	],

	statics: {
		formatName: function(rec) {
			if (!rec.get) {
				rec = Ext.create('NP.model.jobcosting.JbJobCode', rec);
			}
			if (rec.get('jbjobcode_id') === null) {
				return '';
			}

			var val = rec.get('jbjobcode_name') + ' - ';
			if (rec.get('jbjobcode_desc') != '' && rec.get('jbjobcode_desc') !== null) {
				val += rec.get('jbjobcode_desc');
			} else {
				val += 'No Desc.';
			}
			return val;
		}
	}
});