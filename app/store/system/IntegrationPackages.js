/**
 * Store for IntegrationPackages. This store uses the IntegrationPackage fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to IntegrationPackage.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.system.IntegrationPackages', {
    extend: 'NP.lib.data.Store',
	
    requires: ['NP.model.system.IntegrationPackage'],

    constructor: function(cfg) {
    	var that = this;
    	
    	Ext.apply(this, cfg);

    	this.fields = [];
    	Ext.Array.each(NP.model.system.IntegrationPackage.getFields(), function(field) {
            that.fields.push({
                name: field.name,
                type: field.type.type,
                dateFormat: field.dateFormat
            });
        });

    	this.callParent(arguments);
    }    
});