/**
 * Created by Andrey Baranov
 * date: 1/17/14 1:43 PM
 */

Ext.define('NP.model.system.ConfigSysLkpVal', {
	extend: 'Ext.data.Model',

	requires: ['NP.lib.core.Config'],

	idProperty: 'configsyslkpval_id',
	fields: [
		{ name: 'configsyslkpval_id', type: 'int' },
		{ name: 'configsyslkp_id', type: 'int' },
		{ name: 'configsyslkpval_name' },
		{ name: 'configsyslkpval_val' },
		{ name: 'configsyslkpval_order', type: 'int' }
	]
});