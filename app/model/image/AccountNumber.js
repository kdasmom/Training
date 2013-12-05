Ext.define('NP.model.image.AccountNumber', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'utilityaccount_accountnumber',
	fields: [
		{ name: 'utilityaccount_accountnumber', type: 'int' },
	]
});