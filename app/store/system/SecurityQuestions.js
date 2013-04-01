/**
 * Store for Security Questions
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.system.SecurityQuestions', {
	extend: 'NP.lib.data.Store',
	
	fields: [
		{ name: 'lookupcode_id', type: 'int'},
		{ name: 'lookupcode_description' }
	],
	
	service: 'ConfigService',
    action: 'getLookupCodes',
    extraParams: {
    	lookupcode_type: 'securityQuestion'
    }
});