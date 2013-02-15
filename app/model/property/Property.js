Ext.define('NP.model.property.Property', {
	extend: 'Ux.data.Model',
	
    idProperty: 'property_id',
    fields: [
    	{ name: 'property_id', type: 'int' },
    	{ name: 'property_id_alt', type: 'string' },
    	{ name: 'property_name', type: 'string' },
    	{ name: 'property_salestax', type: 'number' },
    	{ name: 'property_no_units', type: 'string' },
    	{ name: 'matching_threshold', type: 'number' },
    	{ name: 'property_status', type: 'string' },
    	{ name: 'property_download', type: 'int' },
    	{ name: 'region_id', type: 'int' },
    	{ name: 'integration_package_id', type: 'int' },
    	{ name: 'fiscaldisplaytype_value', type: 'int' },
    	{ name: 'createdatetm', type: 'date' },
    	{ name: 'property_optionBillAddress', type: 'int' },
    	{ name: 'property_optionShipAddress', type: 'int' },
    	{ name: 'default_billto_property_id', type: 'int' },
    	{ name: 'default_shipto_property_id', type: 'int' },
    	{ name: 'property_volume', type: 'string' },
    	{ name: 'last_updated_datetm', type: 'date' },
    	{ name: 'last_updated_by', type: 'int' },
    	{ name: 'property_nexusservices', type: 'int' },
    	{ name: 'property_vendorcatalog', type: 'int' }
	],
	
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'PropertyService',
			action: 'get'
		}
    }
});
