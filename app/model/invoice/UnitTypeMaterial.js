/**
 * Model for a UnitTypeMaterial
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.invoice.UnitTypeMaterial', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'unittype_material_id',
	fields: [
		{ name: 'unittype_material_id', type: 'int' },
		{ name: 'unittype_material_name' }
	],

	validations: [
		{ field: 'unittype_material_name', type: 'length', max: 50 }
	]
});