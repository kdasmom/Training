Ext.define('NP.lib.data.Store', {
	extend: 'Ext.data.Store',
	
	constructor: function(cfg) {
    	Ext.applyIf(cfg, {
    		proxy: {
				type: 'ajax',
				url : 'ajax.php',
				extraParams: {
					service: cfg.service,
					action : cfg.action
				}
			}
    	});

    	if (cfg.extraParams) {
	    	Ext.apply(cfg.proxy.extraParams, cfg.extraParams);
	    }

	    if (cfg.paging && cfg.paging === true) {
	    	Ext.applyIf(cfg, {
	    		remoteSort: true
	    	});

	    	Ext.applyIf(cfg.proxy, {
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
    },

	getSlave: function() {
		var slaveStore = Ext.create(Ext.getClassName(this));
    	slaveStore.loadRawData(cfg.getProxy().getReader().rawData);
    	return slaveStore;
    }
});