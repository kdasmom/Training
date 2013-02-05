Ext.define('NP.store.invoice.RegisterAbstract', {
    extend: 'Ext.data.Store',
    
    model: 'NP.model.invoice.Invoice',
	remoteSort: true,
	
    constructor: function(cfg) {
    	cfg.proxy = {
	        type: 'ajax',
	        url: 'ajax.php',
			extraParams: {
				service: 'invoice.InvoiceService',
				action: 'findOpenInvoices'
			},
	        reader: {
	            type: 'json',
	            root: 'data',
				totalProperty: 'total'
	        },
	        limitParam: 'pageSize',
			pageParam: 'page',
			sortParam: 'sort',
			encodeSorters: function(sorters) {
				var length   = sorters.length,
				sortStrs = [],
				sorter, i;
				
				for (i = 0; i < length; i++) {
					sorter = sorters[i];
					
					sortStrs[i] = sorter.property + ' ' + sorter.direction
				}
				
				return sortStrs.join(",");
			}
	    }
	    
    	// Use the proxyAction configuration option to set the service action that needs to run
    	if (this.proxyAction) {
    		cfg.proxy.extraParams.action = this.proxyAction;
    	}
    	
    	this.callParent(arguments);
    }
    
});