/**
 * Model for a IntegrationPackage
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.system.IntegrationPackage', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'integration_package_id',
	fields: [
		{ name: 'integration_package_id', type: 'int' },
		{ name: 'integration_package_datasource' },
		{ name: 'integration_package_name' },
		{ name: 'asp_client_id', type: 'int' },
		{ name: 'integration_package_type_id', type: 'int' },
		{ name: 'is_standalone', type: 'int', defaultValue: 0 },
		{ name: 'Integration_Package_ManualTransfer', type: 'int', defaultValue: 0 },
		{ name: 'universal_field_status', type: 'int', defaultValue: 1 }
	],

	validations: [
		{ field: 'integration_package_datasource', type: 'presence' },
		{ field: 'integration_package_datasource', type: 'length', max: 50 },
		{ field: 'integration_package_name', type: 'presence' },
		{ field: 'integration_package_name', type: 'length', max: 50 }
	]
});