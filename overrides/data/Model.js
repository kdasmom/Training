// Override Model's validate() function so that blank/null values are only validated if not blank
// (presence validation rule should take care of values that shouldn't be blank)
Ext.define('overrides.data.Model', {
	override: 'Ext.data.Model',

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
                
                // Only validate non blank/null values with rules other than presence
                if (type && (type == 'presence' || (this.get(field) !== '' && this.get(field) !== null))) {
                	valid = validators[type](validation, this.get(field), this);
                	
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