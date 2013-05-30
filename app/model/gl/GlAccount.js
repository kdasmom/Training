/**
 * Model for a GlAccount
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.gl.GlAccount', {
	extend: 'NP.lib.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'glaccount_id',
	fields: [
		{ name: 'glaccount_id', type: 'int' },
		{ name: 'glaccount_name' },
		{ name: 'glaccount_number' },
		{ name: 'glaccount_status' },
		{ name: 'glaccount_amount' },
		{ name: 'glaccounttype_id', type: 'int' },
		{ name: 'glaccount_level', type: 'int' },
		{ name: 'glaccount_usable' },
		{ name: 'glaccount_order', type: 'int' },
		{ name: 'integration_package_id', type: 'int' },
		{ name: 'glaccount_updateby', type: 'int' },
		{ name: 'glaccount_updatetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() }
	],

	validations: [
		{ field: 'glaccount_name', type: 'length', max: 255 },
		{ field: 'glaccount_number', type: 'length', max: 50 },
		{ field: 'glaccount_status', type: 'length', max: 50 },
		{ field: 'glaccount_usable', type: 'length', max: 1 }
	]
});