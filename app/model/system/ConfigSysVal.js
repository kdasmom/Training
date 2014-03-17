/**
 * Created by Andrey Baranov
 * date: 1/17/14 5:11 PM
 */

Ext.define('NP.model.system.ConfigSysVal', {
	extend: 'Ext.data.Model',

	requires: ['NP.lib.core.Config'],

	idProperty: 'configsysval_id',
	fields: [
		{ name: 'configsysval_id', type: 'int' },
		{ name: 'configsys_id', type: 'int' },
		{ name: 'configsysclient_id', type: 'int' },
		{ name: 'configsysval_val' },
		{ name: 'configsysval_load' },
		{ name: 'configsysval_show' },
		{ name: 'configsysval_active' },
		{ name: 'configsysval_created_datetm', type: 'date' },
		{ name: 'configsysval_created_by', type: 'int' },
		{ name: 'configsysval_updated_datetm', type: 'date' },
		{ name: 'configsysval_updated_by', type: 'int' }
	]
});