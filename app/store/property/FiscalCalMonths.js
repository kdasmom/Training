/**
 * Store for FiscalCalMonths. This store uses the FiscalCalMonth fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to FiscalCalMonth.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.property.FiscalCalMonths', {
    extend: 'NP.lib.data.Store',
	
    requires: ['NP.model.property.FiscalCalMonth'],

    constructor: function(cfg) {
    	var that = this;
    	
    	Ext.apply(this, cfg);

    	this.fields = [];
    	Ext.Array.each(NP.model.property.FiscalCalMonth.getFields(), function(field) {
            that.fields.push({
                name: field.name,
                type: field.type.type,
                dateFormat: field.dateFormat
            });
        });

    	this.callParent(arguments);
    }    
});