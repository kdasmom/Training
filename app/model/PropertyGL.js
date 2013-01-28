Ext.define('NP.model.PropertyGL', {
	extend: 'Ux.data.Model',
	
	idProperty: 'propertyglaccount_id',
    fields: [
    	{ name: 'propertyglaccount_id', type: 'int' },
    	{ name: 'property_id', type: 'int' },
    	{ name: 'glaccount_id', type: 'int' }
	]
});
