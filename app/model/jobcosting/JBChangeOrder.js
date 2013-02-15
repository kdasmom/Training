Ext.define('NP.model.jobcosting.JBChangeOrder', {
    extend: 'Ux.data.Model',
    idProperty: 'jbchangeorder_id',
    fields: [
    	{ name: 'jbchangeorder_id', type: 'int' },
    	{ name: 'jbchangeorder_name', type: 'string' },
    	{ name: 'jbchangeorder_desc', type: 'string' }
    ],
	
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'JobCostingService',
			action: 'getChangeOrders'
		}
    }
});