/**
 * Store for Units. This store uses the Unit fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to Unit.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.property.Units', {
    extend: 'NP.lib.data.Store',
	
    requires: ['NP.model.property.Unit'],

    constructor: function(cfg) {
    	var that = this;
    	
    	Ext.apply(this, cfg);

    	this.fields = [];
    	Ext.Array.each(NP.model.property.Unit.getFields(), function(field) {
            that.fields.push({
                name: field.name,
                type: field.type.type,
                dateFormat: field.dateFormat
            });
        });

        this.fields.push(
            { name: 'unittype_id_alt' },
            { name: 'unittype_name' }
        );

    	this.callParent(arguments);
    }    
});