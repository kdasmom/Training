/**
 * Model for a UnitTypeVal
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.property.UnitTypeVal', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'unittype_val_id',
	fields: [
		{ name: 'unittype_val_id', type: 'int' },
		{ name: 'unittype_id', type: 'int' },
		{ name: 'unittype_material_id', type: 'int' },
		{ name: 'unittype_meas_id', type: 'int' },
		{ name: 'unittype_val_val', type: 'float' }
	],

	validations: [
		{ field: 'unittype_id', type: 'presence' },
		{ field: 'unittype_material_id', type: 'presence' },
		{ field: 'unittype_meas_id', type: 'presence' },
		{ field: 'unittype_val_val', type: 'presence' }
	]
});