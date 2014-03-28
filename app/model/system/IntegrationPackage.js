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
		{ name: 'universal_field_status', type: 'int', defaultValue: 1 },

		// These fields are part of the INTEGRATIONREQUIREMENTS table
		{ name: 'integration_requirements_id', type: 'int' },
		{ name: 'invoice_ref_max', type: 'int' },
		{ name: 'vendor_name_max', type: 'int' },
		{ name: 'vendor_new_DefaultGLCodeOnly', type: 'int' },
		{ name: 'lineitem_description_max', type: 'int' },
		{ name: 'receipt_notes_max', type: 'int' },
		{ name: 'insurance_policynumber_max', type: 'int' },
		{ name: 'vendor_code_max', type: 'int' },
		{ name: 'custom_field7_maxlength', type: 'int' },
		{ name: 'custom_field8_maxlength', type: 'int' },
		{ name: 'receipt_customnotes_max', type: 'int' },
		{ name: 'vendor_city_max', type: 'int' },
		{ name: 'custom_field7_lineitem_maxlength', type: 'int' },
		{ name: 'custom_field8_lineitem_maxlength', type: 'int' },
		{ name: 'vendor_address1_max', type: 'int' }
	],

	validations: [
		{ field: 'integration_package_datasource', type: 'presence' },
		{ field: 'integration_package_datasource', type: 'length', max: 50 },
		{ field: 'integration_package_name', type: 'presence' },
		{ field: 'integration_package_name', type: 'length', max: 50 }
	]
});