/**
 * Model for a EmailAlertType
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.notification.EmailAlertType', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'emailalerttype_id',
	fields: [
		{ name: 'emailalerttype_id', type: 'int' },
		{ name: 'emailalerttype_name' },
		{ name: 'emailalerttype_function', type: 'int' },
		{ name: 'emailalerttype_category' },
		{ name: 'emailalerttype_module_id_list' },
		{ name: 'emailalerttype_id_alt', type: 'int' },
		{ name: 'emailalerttype_showdays', type: 'int' }
	],

	validations: [
		{ field: 'emailalerttype_id', type: 'presence' },
		{ field: 'emailalerttype_name', type: 'length', max: 100 },
		{ field: 'emailalerttype_category', type: 'length', max: 35 },
		{ field: 'emailalerttype_module_id_list', type: 'length', max: 250 }
	]
});