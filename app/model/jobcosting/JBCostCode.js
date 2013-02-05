Ext.define('NP.model.jobcosting.JBCostCode', {
    extend: 'Ux.data.Model',
    idProperty: 'jbcostcode_id',
    fields: [
    	{ name: 'jbcostcode_id', type: 'int' },
    	{ name: 'jbcostcode_name', type: 'string' },
    	{ name: 'jbcostcode_desc', type: 'string' },
    	{ name: 'jbcostcode_category', type: 'string' },
    	{ name: 'jbjobtype_id', type: 'int' },
    	{ name: 'jbjobcode_id', type: 'int' },
    	{ name: 'jbphasecode_id', type: 'int' },
    	{ name: 'glaccount_id', type: 'int' }
    ],
	
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'jobcosting.JobCostingService',
			action: 'getCostCodes'
		}
    }
});