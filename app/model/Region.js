Ext.define('NP.model.Region', {
	extend: 'Ux.data.Model',
	
    idProperty: 'region_id',
    fields: [
    	{ name: 'region_id', type: 'int' },
    	{ name: 'region_name', type: 'string' },
        { name: 'universal_field_status', type: 'int' }
	]
});
