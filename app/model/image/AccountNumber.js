Ext.define('NP.model.image.AccountNumber', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'utilityAccount_accountNumber',
	fields: [
		{ name: 'utilityAccount_accountNumber', type: 'int' },
	]
});