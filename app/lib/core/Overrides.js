/**
 * This has all the overrides needed for our app
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.core.Overrides', function() {
	// Override default location or validation messages
	Ext.override(Ext.form.field.Base, {
		msgTarget: 'under'
	});

	// Override useNull in data fields
	Ext.override(Ext.data.Field, {
		useNull: true
	});

	// Add a capitalize formatting function
	Ext.apply(Ext.util.Format, {
		capitalize: function(val) {
		    var re = /(^|[^\w])([a-z])/g,
		        fn = function(m, a, b) {
		            return a + b.toUpperCase();
		        };
		    return val.toLowerCase().replace(re, fn);
		}
	});

	// Add a password validation
	Ext.apply(Ext.data.validations, {
		passwordMessage: 'Password needs to have at least on letter, one number, one special character, and be 6 characters or more',
		password: function(config, value) {
			return (/\d/.test(value) && /[a-z]/i.test(value) && /[!@#$%&*?]/.test(value) && value.length >= 6);
		}
	});

	// Override Model's validate() function so that blank/null values are only validated if not blank
	// (presence validation rule should take care of values that shouldn't be blank)
	Ext.override(Ext.data.Model, {
		validate: function() {
	        var errors      = new Ext.data.Errors(),
	            validations = this.validations,
	            validators  = Ext.data.validations,
	            length, validation, field, valid, type, i;

	        if (validations) {
	            length = validations.length;

	            for (i = 0; i < length; i++) {
	                validation = validations[i];
	                field = validation.field || validation.name;
	                type  = validation.type;
	                // Only validate blank/null values for the presence validation rule
	                if (type == 'presence' || (this.get(field) !== '' && this.get(field) !== null)) {
		                valid = validators[type](validation, this.get(field));

		                if (!valid) {
		                    errors.add({
		                        field  : field,
		                        message: validation.message || validators[type + 'Message']
		                    });
		                }
		            }
	            }
	        }

	        return errors;
	    }
	});

	return {
		singleton: true
	}
});