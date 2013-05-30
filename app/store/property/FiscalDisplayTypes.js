/**
 * Store for FiscalDisplayTypes. This store uses the FiscalDisplayType fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to FiscalDisplayType.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.property.FiscalDisplayTypes', {
    extend: 'NP.lib.data.Store',
	
    requires: ['NP.model.property.FiscalDisplayType'],

    constructor: function(cfg) {
    	var that = this;
    	
    	Ext.apply(this, cfg);

    	this.fields = [];
    	Ext.Array.each(NP.model.property.FiscalDisplayType.getFields(), function(field) {
            that.fields.push({
                name: field.name,
                type: field.type.type,
                dateFormat: field.dateFormat
            });
        });

    	this.callParent(arguments);
    }    
});