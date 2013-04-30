/**
 * Definition for abstract catalog implementation
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.types.AbstractCatalog', {

    assignmentTabs: ['categories','vendors','properties'],

	getFields: function() {
		throw 'You must implement a getFields() function that returns an array of fields';
	},

	getVisibleTabs: function() {
		throw 'You must implement a getVisibleTabs() function that returns an array of tab strings';
	},

	isValid: function(form, vc) {
		var that = this;
		var isValid = true;
		Ext.Array.each(that.assignmentTabs, function(val) {
            if (Ext.Array.contains(that.getVisibleTabs(), val)) {
                var field = form.findField('vc_' + val);
                if (field.getValue().length == 0) {
                    field.markInvalid('This field is required.');
                    isValid = false;
                }
            }
        });

        return isValid;
	},

	getView: function(vc) {
		throw 'You must implement a getView() function that returns an array of tab strings';
	},

});