/**
 * Model for a PropertyGL
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.import.PropertyGL', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'PropertyCode' },
		{ name: 'GLCode' },
		{ name: 'IntegrationPackage' },
                { name: 'validation_status' },
	],

	validations: [
		{ field: 'PropertyCode', type: 'length', max: 10 },
		{ field: 'GLCode', type: 'length', max: 10 },
		{ field: 'IntegrationPackage', type: 'length', max: 50 }
	]
});