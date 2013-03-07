Ext.define('NP.model.jobcosting.JBPhaseCode', {
    extend: 'NP.lib.data.Model',
    idProperty: 'jbphasecode_id',
    fields: [
    	{ name: 'jbphasecode_id', type: 'int' },
    	{ name: 'jbphasecode_name', type: 'string' },
    	{ name: 'jbphasecode_desc', type: 'string' },
    	{ name: 'jbjobtype_id', type: 'int' },
    	{ name: 'jbjobcode_id', type: 'int' }
    ],
	
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'JobCostingService',
			action: 'getPhaseCodes'
		}
    }
});