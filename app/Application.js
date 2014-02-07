/**
 * Application definition file
 *
 * @author Thomas Messier
 */
Ext.define('NP.Application', {
    name: 'NP',

    extend: 'Ext.app.Application',

	requires: [
		'overrides.app.EventDomain',
		'overrides.data.Field',
		'overrides.data.Model',
		'overrides.data.Validations',
		'overrides.form.field.Base',
		'overrides.form.field.ComboBox',
		'overrides.form.field.Number',
		'overrides.form.Basic',
		'overrides.form.Panel',
		'overrides.grid.column.Column',
		'overrides.grid.plugin.CellEditing',
		'overrides.util.Format',
		'overrides.util.Sorter',
		'overrides.Component',
		'overrides.JSON',
		'Ext.util.History',
		'Ext.state.*',
		'NP.lib.core.DataLoader',
		'NP.lib.core.DBProvider',
		'NP.lib.core.KeyManager',
		'NP.lib.core.Security',
		'NP.lib.core.Net',
		'NP.lib.core.Translator',
		'NP.view.Viewport'
	],
	
	controllers: [
		'Viewport',
		'BudgetOverage',
		'Favorites',
		'CatalogMaintenance',
		'Images',
		'Import',
		'Invoice',
		'MessageCenter',
		'MobileSetup',
		'MySettings',
		'PropertySetup',
		'SystemSetup',
		'UserManager',
		'UtilitySetup',
		'VendorCatalog',
		'VendorManager'
	],

	statcategoriesloaded: false,
	statsloaded         : false,

	/**
     * @private
	 * @param {Ext.app.Application} app The application object for the app being launched
	 */
	launch: function(app) {
		var me = this;
		
		// Start loading the minimum inital data we need to be able to run the application
		NP.lib.core.DataLoader.loadStartupData(function(res) {
            // Language to load; static for now, will be updated in future when we offer more languages
            var lang = 'en';
            
            // Inject the correct file for localization
            NP.Translator.loadLocale(lang);

			// We need to wait for our summary stats to be loaded before we can proceed
        	Ext.getStore('system.SummaryStatCategories').on('statcategoriesloaded', function() {
                me.statcategoriesloaded = true;
        	});

        	// We need to wait for our summary stats to be loaded before we can proceed
        	Ext.getStore('system.SummaryStats').on('statsloaded', function() {
                me.statsloaded = true;
        	});

        	me.startApp();
        });
	},
    
	startApp: function() {
		var me = this;

		// Only start the app if all our data has been properly loaded
		if (me.statcategoriesloaded && me.statsloaded) {
			Ext.get('loading-app').remove();

			// Create the ViewPort
	        Ext.create('NP.view.Viewport');
	        
	        // Init the history module so we can use the back and forward buttons
	        me.initHistory();
	        
	        // Initialize state manager
	        me.stateProvider = Ext.create('NP.lib.core.DBProvider');
	        Ext.state.Manager.setProvider(me.stateProvider);
	        
	        // Initialize the UI state so that we start on whatever page is in the URL fragment
	        me.initState();
		} else {
			Ext.defer(Ext.bind(me.startApp, me), 500);
		}
	},

    /**
	 * Initializes the Ext.History module so we can track where we are through the URL fragment
     * @private
	 */
    initHistory: function() {
		Ext.log('Initializing Ext.History');
		
		var app = this;

		// Initialize the  History module
		Ext.History.init();
		
		// Setup the event that gets triggered whenever the URL fragment changes
		Ext.History.on('change', function(token) {
			Ext.log('History has changed to ' + token);
			app.gotoToken(token);
		});
	},

	/**
	 * Makes sure that the application opens on the page we currently have specified in the URL fragment
     * @private
	 */
	initState: function() {
		// Get the token that's in the URL fragment
		var token = Ext.History.getToken();
		
		Ext.log('Initial token: ' + token);
		
		// Go to the initial token
		this.gotoToken(token);
	},
    
    /**
     * Examines the token and routes the application accordingly if appropriate. This also checks
     * the token hash (last part of the token) to make sure it's valid, if it isn't it boots the
     * user to the home page. This is to prevent URL tampering.
     * @private
     */
	gotoToken: function(token) {
		this.getController('Favorites').refreshFavoriteButtons(token);

		Ext.log('Going to token: ' + token);

		// If the token is not null, do some operations to get the hash
		if (token) {
			// Break up the token into an array
			var tokenParts = token.split(':');
			// The user hash is the last item in the array
			var userHash = tokenParts[tokenParts.length-1];
			tokenParts.pop();
			// The token hash follows
			var tokenHash = tokenParts[tokenParts.length-1];
			tokenParts.pop();
			// The new token is going to exclude the hashes
			var newToken = tokenParts.join(':');
		}
		
		// If token is null, go to home page; otherwise, hash the token (minus last item) 
		// and compare with the hash that was embedded in the token (last item)
		if (token) {
			if (userHash == CryptoJS.SHA1(NP.Security.getUser().get('userprofile_id')+'') && tokenHash == CryptoJS.SHA1(newToken)) {
				var args = newToken.split(':');
				this.runAction.apply(this, args);
			} else {
				Ext.log('Booting to the home page');
				this.addHistory('Viewport:home:dashboard');
			}
		} else {
			this.runAction('Viewport', 'home');
		}
	},
    
    /**
     * This is the equivalent of a PHP location redirect. The token specified gets added to the URL
     * fragment, which triggers the Ext.History change event. This function should be called whenever
     * navigating to a different view since it also takes care of adding the security hash to the token.
     * @param {String} newToken The new token to navigate to
     */
	addHistory: function(newToken) {
		var oldToken = Ext.History.getToken();
		
		if (oldToken === null || oldToken !== newToken) {
			// Hash the entire token
			var tokenHash = CryptoJS.SHA1(newToken);
			var userIdHash = CryptoJS.SHA1(NP.Security.getUser().get('userprofile_id')+'');
			Ext.History.add(newToken+':'+tokenHash + ':' + userIdHash);
		}
	},

	/**
	 * This function runs an action from a controller.
	 * @param {String} controller Name of the controller
	 * @param {String} action     Name of the function to run
	 * @param {String...} arg     Variable number of values that will be used as arguments when calling the function (optional)       
	 */
	runAction: function(controller, action) {
		Ext.log('Running controller "' + controller + '" and action "' + action + '"');
		
		var ctl = this.getController(controller);
		
		var args = [];
		if (arguments.length > 2) {
			for (var i=2; i<arguments.length; i++) {
				args.push(arguments[i]);
			}
		}

		ctl[action].apply(ctl, args);
	},
    
    /**
     * Adds a view to a panel if it's not already its first child
     *
     * The purpose of this function is basically to dynamically load views into empty panels.
     * It will usually be used to load views into the main content area, which is why the "panel"
     * argument defaults to "#contentPanel", the main content area of the application.
     * @param  {Ext.Component/String} view        The component to add to a panel if it's not already its first child
     * @param  {Object}               cfg         Configuration parameters for the view (only used if view is a string)
     * @param  {String}               panel       Any selector that can be used by Ext.ComponentQuery to get a container
     * @param  {Boolean}              forceCreate Forces creation/adding of the view even if it already exists
     * @return {Ext.Component}                    Returns the component created (if any) or the existing view object
     */
	setView: function(view, cfg, panel, forceCreate) {
		if (!cfg) var cfg = {};
		if (!panel) var panel = '#contentPanel';
		if (!forceCreate) var forceCreate = false;
		
		var pnl = Ext.ComponentQuery.query(panel)[0];
		var isNewView = true;

		// Get the currently active view in the parent panel
		var currentView = pnl.child();

		// If a string was passed in, check if dealing with a new view or a
		if (!forceCreate) {
			if (typeof view == 'string') {
				// Only create the view if dealing with a different one than the currently active one
				if (Ext.ClassManager.getName(currentView) == view) {
					isNewView = false;
				}
			} else {
				if (currentView == view) {
					isNewView = false;
				}
			}
		}
		
		// If we have a new view, let's add it to the parent panel
		if (isNewView) {
			// If updating main content panel, abort all requests that have been made so that
			// we don't get UI errors when they complete
			if (panel === '#contentPanel') {
				Ext.log('Aborting all Ajax requests because of call to set view ' + view);
				NP.Net.abortAllRequests();
			}
			
			// Remove all child elements from the parent panel
			pnl.removeAll();
			
			// If we passed view in as a string, we need to create the view object; the reason we do it this late in
			// the process is that removeAll() has to run before it just to minimize the chance of naming conflicts
			if (typeof view == 'string') {
				view = Ext.create(view, cfg);
			}

			// If the parent panel is the main content area, we need to add the center region config option
			if (panel == '#contentPanel') {
				view.region = 'center';
			}

			// Add the view to the parent panel
			pnl.add(view);
		} else {
			view = currentView;
		}

		return view;
	},
	
	/**
	 * Utility function to return the first child view in the main content panel
	 * @return {Ext.container.Container}
	 */
	getCurrentView: function() {
		return Ext.ComponentQuery.query('#contentPanel')[0].child();
	},
	
	/**
	 * Utility function to return a component for a specified xtype
	 * @param  {String}                  comp The component xtype to retrieve
	 * @return {Ext.container.Container}
	 */
	getComponent: function(comp) {
		var comp = Ext.ComponentQuery.query('[xtype="' + comp + '"]');
		
		if (comp.length) {
			return comp[0];
		}

		return null;
	},

	getStateProvider: function() {
		return this.stateProvider;
	},

	/**
	 * Utility function to load a store only once under a specified store ID
	 * @param  {String}         storeId      The unique Id for the store to be used byt the store manager to locate this store
	 * @param  {String}         store        The class path of the store
	 * @param  {String}         [cfg]        Additional configuration options for the store
	 * @param  {Function}       [callbackFn] Options callback function for when the operation has run and data is loaded in the store
	 * @return {Ext.data.Store}
	 */
	loadStore: function(storeId, store, cfg, callbackFn) {
		if (!cfg) cfg = {};

		var storeObj = Ext.StoreManager.lookup(storeId);
		if (!storeObj) {
			cfg.storeId = storeId;
			storeObj = Ext.create(store, cfg);
			storeObj.load({
				callback: function() {
					if (callbackFn) { 
						callbackFn(); 
					}
				}
			});
		} else if (callbackFn) { 
			callbackFn();
		}

		return storeObj;
	}
	
});