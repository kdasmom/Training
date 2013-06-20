/**
 * Store for PnCustomFieldss. This store uses the PnCustomFields fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to PnCustomFields.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.system.PnCustomFields', {
    extend: 'NP.lib.data.Store',
	
    requires: ['NP.model.system.PnCustomField'],

    constructor: function(cfg) {
    	var that = this;
    	
    	Ext.apply(this, cfg);

    	this.fields = [];
    	Ext.Array.each(NP.model.system.PnCustomField.getFields(), function(field) {
            that.fields.push({
                name: field.name,
                type: field.type.type,
                dateFormat: field.dateFormat
            });
        });

    	this.callParent(arguments);
    }    
});