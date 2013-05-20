/**
 * Store for Userprofiles. This store uses the Userprofile fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to Userprofile.
 *
 * @author 
 */
Ext.define('NP.store.user.Userprofiles', {
    extend: 'NP.lib.data.Store',
	
    requires: ['NP.model.user.Userprofile'],

    constructor: function(cfg) {
    	Ext.apply(this, cfg);

    	this.fields = NP.model.user.Userprofile.getFields();
    	this.fields.push(
    		{ name: 'person_firstname' },
    		{ name: 'person_lastname' }
    	);

    	this.callParent(arguments);
    }    
});