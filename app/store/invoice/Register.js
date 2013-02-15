Ext.define('NP.store.invoice.Register', {
    extend: 'Ext.data.Store',
    
	model     : 'NP.model.invoice.Invoice',
	remoteSort: true,
	
	proxy     : {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'UserService',
			action : 'getInvoiceRegister'
		},
        reader: {
			type         : 'json',
			root         : 'data',
			totalProperty: 'total'
        },
		limitParam: 'pageSize',
		pageParam : 'page',
		sortParam : 'sort',
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
    
});