/**
 * Store is a class that extends the base Ext.data.Store class to provide some additional configuration options
 * to simplify tedious things that are frequently needed. This is only to be used for Ajax stores.
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.data.Store', {
	extend: 'Ext.data.Store',

	requires: ['NP.lib.data.JsonFlat'],
	
	/**
	 * @cfg {String}  service (required)            The service this store will use when making ajax requests
	 */
	/**
	 * @cfg {String}  action (required)             The action this store will use when making ajax requests
	 */
	/**
	 * @cfg {Object}  extraParams                   Additional parameters that you want sent with the ajax request
	 */
	extraParams: {},
	/**
	 * @cfg {Boolean} paging                        Whether or not paging will be used with this store
	 */
	paging: false,
	/**
	 * @cfg {"json"\"jsonflat"}  reader="jsonflat"  Which type of reader to use for this store
	 */
	reader: 'jsonflat',

	constructor: function(cfg) {
		Ext.apply(this, cfg);
		
		if (this.service) {
			Ext.apply(this, {
	    		proxy: {
					type: 'ajax',
					url : 'ajax.php',
					extraParams: {
						service: this.service,
						action : this.action
					},
					reader: {
						type: this.reader
					}
				}
	    	});

	    	Ext.apply(this.proxy.extraParams, this.extraParams);

		    if (this.paging === true) {
		    	Ext.apply(this, {
		    		remoteSort: true
		    	});

		    	Ext.apply(this.proxy, {
					limitParam: 'pageSize',
					pageParam : 'page',
					reader    : {
						type         : this.reader,
						root         : 'data',
						totalProperty: 'total'
					}
		    	});
		    }

		    Ext.apply(this.proxy, {
				sortParam : 'sort',
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

    /**
     * Makes a copy of this store using the data loaded in the store
     * @return {NP.lib.data.Store}
     */
    getCopy: function() {
    	var records = [];
		this.each(function(r){
			records.push(r.copy());
		});
		var store = Ext.create(Ext.getClassName(this));
		store.add(records);
    	
    	return store;
    },

    /**
	 * Adds extra parameters to the store's proxy
	 * @param {Object} params
	 */
	addExtraParams: function(params) {
    	var proxy = this.getProxy();
		Ext.apply(proxy.extraParams, params);

		return this;
    },

    /**
	 * Shortcut to set the service and action for the store proxy
	 * @param {String} service
	 * @param {String} action
	 */
	setServiceAndAction: function(service, action) {
		if (Ext.ClassManager.getName(this.getProxy()) != 'Ext.data.proxy.Ajax') {
			this.setProxy({
				type: 'ajax',
				url : 'ajax.php'
			});
		}
    	this.addExtraParams({
    		service: service,
			action : action
    	});
    }
});