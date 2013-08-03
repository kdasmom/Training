/**
 * Model for a GlImportAccount
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.gl.GlImportAccount', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	fields: [
		{ name: 'exim_glaccountName' },
		{ name: 'exim_glaccountNumber' },
		{ name: 'exim_accountType' },
		{ name: 'exim_categoryName' },
		{ name: 'exim_integrationPackage' },
                { name: 'exim_status' }
	],

	validations: [
		{ field: 'glaccount_name', type: 'length', max: 50 }
	]
});