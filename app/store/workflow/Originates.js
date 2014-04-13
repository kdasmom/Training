Ext.define('NP.store.workflow.Originates', {
	extend: 'NP.lib.data.Store',

	wfactionid: 'wfaction_id',

	fields: [
		{ name: 'wfaction_id' },
		{ name: 'originator' },
		{ name: 'names' },
		{ name: 'onames' },
		{ name: 'forwards' }
	]
});