// Add a findInvalid() method to form panel
Ext.define('overrides.form.Panel', {
	override: 'Ext.form.Panel',

	findInvalid: function() {
	    var form = this.getForm();
	    
	    var invalid = form.getFields().filterBy(function(field) {
	        return (field.getActiveErrors().length) ? true : false;
	    });
	    
	    return invalid;
	}
});