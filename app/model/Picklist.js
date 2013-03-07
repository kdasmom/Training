Ext.define('NP.model.Picklist', {
	extend: 'NP.lib.data.Model',
	idProperty: 'id',
	fields: [
		{ name: 'id', type: 'int' },
		{ name: 'data', type: 'string' },
		{ name: 'universal_field_status', type: 'int' }
	]
});
