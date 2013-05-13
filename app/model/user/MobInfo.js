/**
 * Model for a MobInfo
 *
 * @author 
 */
Ext.define('NP.model.user.MobInfo', {
	extend: 'NP.lib.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'mobinfo_id',
	fields: [
		{ name: 'mobinfo_id', type: 'int' },
		{ name: 'mobinfo_phone' },
		{ name: 'mobinfo_pin' },
		{ name: 'userprofile_id', type: 'int' },
		{ name: 'mobinfo_activated_datetm', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
		{ name: 'mobinfo_deactivated_datetm', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
		{ name: 'mobinfo_status', defaultValue: 'active' }
	],

	validations: [
		{ field: 'mobinfo_phone', type: 'presence' },
		{ field: 'mobinfo_phone', type: 'digits' },
		{ field: 'mobinfo_phone', type: 'length', min: 10, max: 10 },
		{ field: 'mobinfo_pin', type: 'presence' },
		{ field: 'mobinfo_pin', type: 'digits' },
		{ field: 'mobinfo_pin', type: 'length', min: 4, max: 4 },
		{ field: 'mobinfo_status', type: 'length', max: 50 }
	]
});