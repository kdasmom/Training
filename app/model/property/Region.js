/**
 * Model for a Region entity
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.property.Region', {
	extend: 'NP.lib.data.Model',
	
    idProperty: 'region_id',
    fields: [
    	{ name: 'region_id', type: 'int' },
    	{ name: 'region_name', type: 'string' },
        { name: 'universal_field_status', type: 'int' }
	]
});
