Ext.define('NP.model.jobcosting.JBContract', {
    extend: 'Ux.data.Model',
    idProperty: 'jbcontract_id',
    fields: [
    	{ name: 'jbcontract_id', type: 'int' },
    	{ name: 'jbcontract_default_retention', type: 'number' },
    	{ name: 'jbcontract_name', type: 'string' },
    	{ name: 'jbcontract_desc', type: 'string' },
    	{ name: 'vendorsite_id', type: 'int' },
    	{ name: 'jbcontract_status', type: 'string' },
    	{ name: 'create_datetm', type: 'date' }
    ],
	
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'JobCostingService',
			action: 'getContracts'
		}
    }
});