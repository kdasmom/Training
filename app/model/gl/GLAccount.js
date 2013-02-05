Ext.define('NP.model.gl.GLAccount', {
	extend: 'Ux.data.Model',
	
	requires: ['NP.core.Config'],
	
	statics: {
		getFormattedName: function(glaccount_number, glaccount_name) {
	    	if (glaccount_number != '' && glaccount_name != '') {
	    		var formatted;
	    		var display = NP.core.Config.getSetting('PN.Budget.GLDisplayOrder').toLowerCase();
	    		
				if (display == 'number') {
		    		formatted = glaccount_number + ' (' + glaccount_name + ')';
		    	} else if (display.toLowerCase() == 'numberonly') {
		    		formatted = glaccount_number;
		    	} else {
		    		formatted = glaccount_name + ' (' + glaccount_number + ')';
		    	}
		    	
		    	return formatted;
		    } else {
		    	return '';
		    }
	    }
	},
	
	idProperty: 'glaccount_id',
	fields: [
		{ name: 'glaccount_id', type: 'int' },
		{ name: 'glaccount_name', type: 'string' },
		{ name: 'glaccount_number', type: 'string' },
		{ name: 'glaccount_status', type: 'string' },
		{ name: 'glaccount_usable', type: 'string' },
		{ name: 'glaccounttype_id', type: 'int' },
		{ name: 'glaccounttype_name', type: 'string' },
		{ name: 'integration_package_id', type: 'int' },
		{ name: 'glaccount_fullname', type: 'string', convert: function(val, rec) { return NP.model.gl.GLAccount.getFormattedName(rec.get('glaccount_number'), rec.get('glaccount_name')); } }
	],
	
    proxy: {
        type: 'ajax',
        url: 'Ajax.cfc',
		extraParams: {
			returnFormat: 'json',
			method: 'run',
			service: 'gl.GLService',
			action: 'get'
		}
    }
})
