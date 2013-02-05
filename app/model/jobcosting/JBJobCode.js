Ext.define('NP.model.jobcosting.JBJobCode', {
    extend: 'Ux.data.Model',
    idProperty: 'jbjobcode_id',
    fields: [
    	{ name: 'jbchangeorder_id', type: 'int' },
    	{ name: 'jbjobcode_desc', type: 'string' },
    	{ name: 'jbjobcode_name', type: 'string' },
    	{ name: 'jbjobcode_status', type: 'string' },
    	{ name: 'create_datetm', type: 'string' },
    	{ name: 'jbjobtype_id', type: 'int' },
    	{ name: 'property_id', type: 'int' },
    	{ name: 'glaccount_id', type: 'int' }
    ],
	
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'jobcosting.JobCostingService',
			action: 'getJobCodes'
		}
    }
});