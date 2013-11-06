// Add validation types for Models
Ext.define('overrides.data.Validations', {
	override: 'Ext.data.validations',

	digits: function(config, value) {
		return value.search(/^-?\d+$/) != -1;
	},

	numeric: function(config, value) {
		return value.search(/^-?((\d+(\.\d+)?)|(\.?\d+))$/) != -1;
	},

	password: function(config, value) {
		return (/\d/.test(value) && /[a-z]/i.test(value) && /[!@#$%&*?]/.test(value) && value.length >= 6);
	},

	presence: function(config, value, rec) {
        // No configs read, so allow just value to be passed
        if (arguments.length === 1) {
            value = config;
        }
        
        // Only proceed with more validation checks if the value is blank or null
        if (value === '' || value === null) {
        	if (config.dependency || config.groupFields) {
	        	// If a dependency has been defined
	        	if (config.dependency) {
	        		var val = rec.get(config.dependency);
					if (Ext.Array.contains(config.values, val)) {
						return false;
					}
	        	}
	        	
	        	// If a group has been defined
	        	if (config.groupFields) {
	        		for (var i=0; i<config.groupFields.length; i++) {
						var val = rec.get(config.groupFields[i]);
						
						if (val !== null && val !== '') {
							return false;
						}
					}
	        	}
	        } else {
	        	return false;
	        }
        }

        return true;
    }
});