/**
 * Store for PnUniversalFields. This store uses the PnUniversalField fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to PnUniversalField.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.system.PnUniversalFields', {
    extend: 'NP.lib.data.Store',
	
    requires: ['NP.model.system.PnUniversalField'],

    constructor: function(cfg) {
    	var that = this;
    	
    	Ext.apply(this, cfg);

    	this.fields = [];
    	Ext.Array.each(NP.model.system.PnUniversalField.getFields(), function(field) {
            that.fields.push({
                name: field.name,
                type: field.type.type,
                dateFormat: field.dateFormat
            });
        });

    	this.callParent(arguments);
    }    
});