/**
 * Model for a PnUniversalField
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.system.PnUniversalField', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'universal_field_id',
	fields: [
		{ name: 'universal_field_id', type: 'int' },
		{ name: 'universal_field_data' },
		{ name: 'universal_field_number', type: 'int' },
		{ name: 'universal_field_status', type: 'int' },
		{ name: 'universal_field_order', type: 'int' },
		{ name: 'islineitem', type: 'int' },
		{ name: 'isrelatedto' },
		{ name: 'customfield_pn_type' }
	],

	validations: [
		{ field: 'universal_field_data', type: 'length', max: 100 },
		{ field: 'universal_field_number', type: 'presence' },
		{ field: 'isrelatedto', type: 'length', max: 10 },
		{ field: 'customfield_pn_type', type: 'length', max: 255 }
	]
});