/**
 * Model for a FiscalCal
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.property.FiscalCal', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config','NP.model.property.FiscalCalMonth'],

	idProperty: 'fiscalcal_id',
	fields: [
		{ name: 'fiscalcal_id', type: 'int' },
		{ name: 'property_id', type: 'int' },
		{ name: 'fiscalcal_year', type: 'int' },
		{ name: 'fiscalcal_name' },
		{ name: 'fiscalcal_description' },
		{ name: 'fiscalcal_type', defaultValue: 'template' },
		{ name: 'asp_client_id', type: 'int' }
	],

	hasMany: { model: 'NP.model.property.FiscalCalMonth', name: 'months', foreignKey: 'fiscalcal_id', primaryKey: 'fiscalcal_id' },

	validations: [
		{ field: 'fiscalcal_name', type: 'length', max: 50 },
		{ field: 'fiscalcal_description', type: 'length', max: 255 },
		{ field: 'fiscalcal_type', type: 'length', max: 50 }
	]
});