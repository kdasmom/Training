/**
 * Model for a FiscalCal
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.property.FiscalCal', {
	extend: 'NP.lib.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'fiscalcal_id',
	fields: [
		{ name: 'fiscalcal_id', type: 'int' },
		{ name: 'property_id', type: 'int' },
		{ name: 'fiscalcal_year', type: 'int' },
		{ name: 'fiscalcal_name' },
		{ name: 'fiscalcal_description' },
		{ name: 'fiscalcal_type' },
		{ name: 'asp_client_id', type: 'int' }
	],

	validations: [
		{ field: 'fiscalcal_name', type: 'length', max: 50 },
		{ field: 'fiscalcal_description', type: 'length', max: 255 },
		{ field: 'fiscalcal_type', type: 'length', max: 50 },
		{ field: 'asp_client_id', type: 'presence' }
	]
});