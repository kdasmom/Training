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
		{ name: 'glaccount_status', defaultValue: 'active' },
		{ name: 'glaccount_amount' },
		{ name: 'glaccounttype_id', type: 'int' },
		{ name: 'glaccount_level', type: 'int' },
		{ name: 'glaccount_usable', defaultValue: 'Y' },
		{ name: 'glaccount_order', type: 'int' },
		{ name: 'integration_package_id', type: 'int' },
		{ name: 'glaccount_updateby', type: 'int' },
		{ name: 'glaccount_updatetm', type: 'date' },

		// Fields that don't exist in the DB
		{ name: 'tree_id', type: 'int' },
		{ name: 'tree_parent', type: 'int' },
		
		{ name: 'integration_package_name' },

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
	},
    
    belongsTo: [
        {
            model         : 'NP.model.user.Userprofile',
            name          : 'updatedByUser',
            getterName    : 'getUpdatedByUser',
            foreignKey    : 'UserProfile_ID',
            primaryKey    : 'userprofile_id',
            reader        : 'jsonflat'
        },
        {
            model         : 'NP.model.gl.GlAccountType',
            name          : 'type',
            getterName    : 'getType',
            foreignKey    : 'glaccounttype_id',
            primaryKey    : 'glaccounttype_id',
            reader        : 'jsonflat'
        }
    ],
});