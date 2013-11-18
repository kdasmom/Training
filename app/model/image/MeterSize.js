Ext.define('NP.model.image.MeterSize', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'utilityaccount_metersize',
	fields: [
		{ name: 'utilityaccount_metersize', type: 'int' },
	]
});