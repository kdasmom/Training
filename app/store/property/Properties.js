/**
 * Store for Properties. This store uses the Property fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to Property.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.property.Properties', {
    extend: 'NP.lib.data.Store',
	
    requires: ['NP.model.property.Property'],

    constructor: function(cfg) {
    	var that = this;

    	Ext.apply(this, cfg);

    	this.fields = [];
    	Ext.Array.each(NP.model.property.Property.getFields(), function(field) {
            that.fields.push({
                name: field.name,
                type: field.type.type,
                dateFormat: field.dateFormat
            });
        });
        this.fields.push(
        	{ name: 'integration_package_name' },
        	{ name: 'region_name' },
        	{ name: 'created_by_userprofile_username' },
            { name: 'created_by_person_id', type: 'int' },
        	{ name: 'created_by_person_firstname' },
        	{ name: 'created_by_person_lastname' },
        	{ name: 'last_updated_by_userprofile_username' },
            { name: 'last_updated_by_person_id', type: 'int' },
        	{ name: 'last_updated_by_person_firstname' },
        	{ name: 'last_updated_by_person_lastname' }
        );

    	this.callParent(arguments);
    }    
});