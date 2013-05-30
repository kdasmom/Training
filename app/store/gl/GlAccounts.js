/**
 * Store for GlAccounts. This store uses the GlAccount fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to GlAccount.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.gl.GlAccounts', {
    extend: 'NP.lib.data.Store',
	
    requires: ['NP.model.gl.GlAccount'],

    constructor: function(cfg) {
    	var that = this;
    	
    	Ext.apply(this, cfg);

    	this.fields = [];
    	Ext.Array.each(NP.model.gl.GlAccount.getFields(), function(field) {
            that.fields.push({
                name: field.name,
                type: field.type.type,
                dateFormat: field.dateFormat
            });
        });

    	this.callParent(arguments);
    }    
});