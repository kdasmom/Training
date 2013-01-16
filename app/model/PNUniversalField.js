Ext.define('NP.model.PNUniversalField', {
	extend: 'Ux.data.Model',
	idProperty: 'universal_field_id',
	
	fields: [
		{ name: 'universal_field_id', type: 'int' },
		{ name: 'universal_field_data', type: 'string', convert: NP.core.Util.modelStringConverter },
		{ name: 'universal_field_number', type: 'int' },
		{ name: 'universal_field_status', type: 'string' },
		{ name: 'universal_field_order', type: 'int' },
		{ name: 'islineitem', type: 'int' },
		{ name: 'isrelatedto', type: 'string' },
		{ name: 'customfield_pn_type', type: 'string' }
	],
	
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'system.ConfigService',
			action: 'getCustomFieldDropDownValues'
		}
    }
});