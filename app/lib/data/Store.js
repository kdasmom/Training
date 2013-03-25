/**
 * Store is a class that extends the base Ext.data.Store class to provide some additional configuration options
 * to simplify tedious things that are frequently needed. This is only to be used for Ajax stores.
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.data.Store', {
	extend: 'Ext.data.Store',
	
	/**
	 * @cfg {string}  service (required) The service this store will use when making ajax requests
	 */
	/**
	 * @cfg {string}  action (required)  The action this store will use when making ajax requests
	 */
	/**
	 * @cfg {Object}  extraParams        Additional parameters that you want sent with the ajax request
	 */
	/**
	 * @cfg {boolean} paging             Whether or not paging will be used with this store
	 */
	constructor: function(cfg) {
		Ext.apply(this, cfg);
		
		Ext.applyIf(this, {
    		proxy: {
				type: 'ajax',
				url : 'ajax.php',
				extraParams: {
					service: this.service,
					action : this.action
				}
			}
    	});

    	if (this.extraParams) {
	    	Ext.apply(this.proxy.extraParams, this.extraParams);
	    }

	    if (this.paging === true) {
	    	Ext.applyIf(this, {
	    		remoteSort: true
	    	});

	    	Ext.applyIf(this.proxy, {
				limitParam: 'pageSize',
				pageParam : 'page',
				sortParam : 'sort',
				reader    : {
					type         : 'json',
					root         : 'data',
					totalProperty: 'total'
				},
				encodeSorters: function(sorters) {
					var length   = sorters.length,
					sortStrs = [],
					sorter, i;
					
					for (i = 0; i < length; i++) {
						sorter = sorters[i];
						sortStrs[i] = sorter.property + ' ' + sorter.direction;
					}
					
					return sortStrs.join(",");
				}
	    	});
	    }
		
    	this.callParent(arguments);
    }
});