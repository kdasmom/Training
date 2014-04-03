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

	isLoaded: false,

	constructor: function(cfg) {
		var me = this;

		Ext.apply(me, cfg);
		
		if (me.service) {
			Ext.apply(me, {
	    		proxy: {
					type: 'ajax',
					url : 'ajax.php',
					extraParams: {
						service: me.service,
						action : me.action
					},
					reader: {
						type: me.reader
					}
				}
	    	});

	    	me.lastExtraParamsLoaded = {};

	    	Ext.apply(me.proxy.extraParams, me.extraParams);

		    if (me.paging === true) {
		    	Ext.apply(me, {
		    		remoteSort: true
		    	});

		    	Ext.apply(me.proxy, {
					limitParam: 'pageSize',
					pageParam : 'page',
					reader    : {
						type         : me.reader,
						root         : 'data',
						totalProperty: 'total'
					}
		    	});
		    }

		    Ext.apply(me.proxy, {
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
		} else {
			Ext.applyIf(me, {
	    		proxy: {
					type: 'memory',
					reader: {
						type: me.reader
					}
				}
	    	});
		}
		
    	me.callParent(arguments);

    	if (me.getCount()) {
    		me.isLoaded = true;
    	}

    	// Subscribe to before load to reset the isLoaded property to false when new data gets loaded
    	me.on('beforeload', function() {
    		me.lastExtraParamsLoaded = Ext.clone(me.getExtraParams());
    		me.isLoaded = false;
    	});

    	// Subscribe to load event to set the isLoaded property to true
    	me.on('load', function() {
    		me.isLoaded = true;
    	});
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
	 * Gets extraparams set on the store's proxy
	 * @return {Object}
	 */
	getExtraParams: function() {
    	return this.getProxy().extraParams;
    },

    /**
	 * Gets value of a specific param set on the store's proxy
	 * @param  {string} name
	 * @return {Mixed}
	 */
	getExtraParam: function(name) {
    	return this.getProxy().extraParams[name];
    },

    /**
	 * Sets extraparams set on the store's proxy
	 * @return {Object}
	 */
	setExtraParams: function(val) {
    	this.getProxy().extraParams = val;
    	return this;
    },

    extraParamsHaveChanged: function() {
    	var me          = this,
    		extraParams = me.getExtraParams(),
    		param,
    		className;

    	for (param in extraParams) {
    		if (!(param in me.lastExtraParamsLoaded) || me.lastExtraParamsLoaded[param] !== extraParams[param]) {
    			if (Ext.isArray(extraParams[param])) {
    				className = 'Array';
    			} else if (Ext.isObject(extraParams[param])) {
    				className = 'Object';
    			} else {
    				return true;
    			}

    			return !Ext[className].equals(extraParams[param], me.lastExtraParamsLoaded[param]);
    		}
    	}

    	for (param in me.lastExtraParamsLoaded) {
    		if (!(param in extraParams)) {
    			return true;
    		}
    	}

    	return false;
    },

    loadIfChange: function(callback) {
    	var me = this;

    	callback = callback || Ext.emptyFn;

    	if (me.extraParamsHaveChanged()) {
    		me.load(callback);
    	} else {
    		callback(me.getRange(), null, true);
    	}
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