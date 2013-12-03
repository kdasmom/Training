// Override the basic Forms isValid function to allow exclusion of some fields
Ext.define('overrides.form.Basic', {
	override: 'Ext.form.Basic',

	/**
     * Returns true if client-side validation on the form is successful. Any invalid fields will be
     * marked as invalid. If you only want to determine overall form validity without marking anything,
     * use {@link #hasInvalidField} instead.
     * @param  Object  [options]                Additional options for validation
     * @param  Object  [options.excludedFields] A hash of fields to exclude; name of the field is the key, value can be anything (standard is to make it "true"), we're using a hash for performance only
     * @param  Object  [options.excludedForms]  An array of forms to exclude, each provided as a valid component query string
     * @return Boolean
     */
	isValid: function(options) {
        var me = this,
            invalid;

        //Setup defaults
        if (!arguments.length) options = {};
        Ext.applyIf(options, {
        	excludedFields: {},
        	excludedForms: []
        });

        // Loop through excluded forms to add all their fields to the excluded fields list
        for (var i=0; i<options.excludedForms.length; i++) {
        	var excludedForm = Ext.ComponentQuery.query(options.excludedForms[i])[0];
        	var formFields = excludedForm.getForm().getFields();
        	formFields.each(function(formField) {
        		options.excludedFields[formField.getName()] = true;
        	});
        }

        // Similar code to the original isValid() function except we only return fields that weren't excluded
        Ext.suspendLayouts();
        invalid = me.getFields().filterBy(function(field) {
        	if (field.getName() in options.excludedFields) {
        		return false;
        	} else {
            	return !field.validate();
            }
        });
        Ext.resumeLayouts(true);
        return invalid.length < 1;
    }
});