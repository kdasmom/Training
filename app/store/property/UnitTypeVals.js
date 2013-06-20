/**
 * Store for UnitTypeVals. This store uses the UnitTypeVal fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to UnitTypeVal.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.property.UnitTypeVals', {
    extend: 'NP.lib.data.Store',
	
    requires: ['NP.model.property.UnitTypeVal'],

    constructor: function(cfg) {
    	var that = this;
    	
    	Ext.apply(this, cfg);

    	this.fields = [];
    	Ext.Array.each(NP.model.property.UnitTypeVal.getFields(), function(field) {
            that.fields.push({
                name: field.name,
                type: field.type.type,
                dateFormat: field.dateFormat
            });
        });

    	this.callParent(arguments);
    }    
});