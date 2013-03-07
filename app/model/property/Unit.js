Ext.define('NP.model.property.Unit', {
	extend: 'NP.lib.data.Model',
	
	idProperty: 'unit_id',
    fields: [
    	{ name: 'unit_id', type: 'int' },
    	{ name: 'unit_id_alt', type: 'string' },
    	{ name: 'unit_number', type: 'string' },
    	{ name: 'property_id', type: 'int' },
    	{ name: 'property_name', type: 'string' }
    ],
	
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'UnitService',
			action: 'get'
		}
    }
});