/**
 * Model for a FiscalDisplayType
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.property.FiscalDisplayType', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'fiscaldisplaytype_id',
	fields: [
		{ name: 'fiscaldisplaytype_id', type: 'int' },
		{ name: 'fiscaldisplaytype_name' },
		{ name: 'fiscaldisplaytype_value', type: 'int' },
		{ name: 'fiscaldisplaytype_order' }
	],

	validations: [
		{ field: 'fiscaldisplaytype_name', type: 'presence' },
		{ field: 'fiscaldisplaytype_name', type: 'length', max: 64 },
		{ field: 'fiscaldisplaytype_value', type: 'presence' },
		{ field: 'fiscaldisplaytype_order', type: 'presence' }
	]
});