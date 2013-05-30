/**
 * Store for Regions. This store uses the Region model fields.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.property.Regions', {
	extend: 'NP.lib.data.Store',
	
	requires: ['NP.model.property.Region'],

    constructor: function(cfg) {
    	var that = this;

        Ext.apply(this, cfg);

    	this.fields = [];
    	Ext.Array.each(NP.model.property.Region.getFields(), function(field) {
            that.fields.push({
                name: field.name,
                type: field.type.type,
                dateFormat: field.dateFormat
            });
        });

    	this.callParent(arguments);
    }
});