/**
 * Model for a JbPhaseCode
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.jobcosting.JbPhaseCode', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'jbphasecode_id',
	fields: [
		{ name: 'jbphasecode_id', type: 'int' },
		{ name: 'jbphasecode_name' },
		{ name: 'jbphasecode_desc', useNull: false },
		{ name: 'jbjobtype_id', type: 'int' },
		{ name: 'jbjobcode_id', type: 'int' },

		// Calculated field that doesn't exist in the DB
		{
			name: 'display_name',
			convert: function(v, rec) {
				var val = rec.get('jbphasecode_name') + ' - ';
				if (rec.get('jbphasecode_desc') != '') {
					val += rec.get('jbphasecode_desc');
				} else {
					val += 'No Desc.';
				}
				return val;
			}
		}
	]
});