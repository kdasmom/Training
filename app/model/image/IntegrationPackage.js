/**
 * Model for a IntegrationPackage
 *
 * @author 
 */
Ext.define('NP.model.image.IntegrationPackage', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'integration_package_id',
	fields: [
		{ name: 'integration_package_id', type: 'int' },
		{ name: 'integration_package_name' },
		{ name: 'asp_client_id', type: 'int' },
		{ name: 'integration_package_type_id', type: 'int' },
		{ name: 'is_standalone', type: 'int' }
	]
});