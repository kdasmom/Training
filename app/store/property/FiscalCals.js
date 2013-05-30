/**
 * Store for FiscalCals. This store uses the FiscalCal fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to FiscalCal.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.property.FiscalCals', {
    extend: 'NP.lib.data.Store',
	
    requires: ['NP.model.property.FiscalCal'],

    constructor: function(cfg) {
    	var that = this;
    	
    	Ext.apply(this, cfg);

    	this.fields = [];
    	Ext.Array.each(NP.model.property.FiscalCal.getFields(), function(field) {
            that.fields.push({
                name: field.name,
                type: field.type.type,
                dateFormat: field.dateFormat
            });
        });

    	this.callParent(arguments);
    }    
});