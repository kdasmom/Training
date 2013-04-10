/**
 * Model for a Staff
 *
 * @author 
 */
Ext.define('NP.model.user.Staff', {
	extend: 'NP.lib.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'staff_id',
	fields: [
		{ name: 'staff_id', type: 'int' },
		{ name: 'staff_id_alt' },
		{ name: 'person_id', type: 'int' },
		{ name: 'staff_status' }
	],

	validations: [
		{ field: 'staff_id', type: 'presence' },
		{ field: 'staff_id_alt', type: 'length', max: 15 },
		{ field: 'staff_status', type: 'length', max: 50 }
	]
});