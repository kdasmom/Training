/**
 * Model for a GlAccount
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.gl.GlAccount', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'glaccount_id',
	fields: [
		{ name: 'glaccount_id', type: 'int' },
		{ name: 'glaccount_name' },
		{ name: 'glaccount_number' },
		{ name: 'glaccount_status' },
		{ name: 'glaccount_amount' },
		{ name: 'glaccounttype_id', type: 'int' },
		{ name: 'glaccount_level', type: 'int' },
		{ name: 'glaccount_usable' },
		{ name: 'glaccount_order', type: 'int' },
		{ name: 'integration_package_id', type: 'int' },
		{ name: 'glaccount_updateby', type: 'int' },
		{ name: 'glaccount_updatetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },

		// Calculated field that doesn't exist in the DB
		{
			name: 'display_name',
			convert: function(v, rec) {
				if (rec.get('glaccount_id') === null) {
					return '';
				}
				return NP.model.gl.GlAccount.formatName(rec.get('glaccount_number'), rec.get('glaccount_name'));
			}
		}
	],

	statics: {
		formatName: function(glaccount_number, glaccount_name) {
			var glDisplay = NP.Config.getSetting('PN.Budget.GLDisplayOrder', 'number').toLowerCase();
			
	    	if (glDisplay == 'number') {
	    		return glaccount_number + ' (' + glaccount_name + ')';
	    	} else if (glDisplay == 'numberonly') {
	    		return glaccount_number;
	    	} else if (glDisplay == 'name') {
	    		return glaccount_name + ' (' + glaccount_number + ')';
	    	}
		}
	}
});