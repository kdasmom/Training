Ext.Loader.setConfig({
	enabled: true
});

/**
 * This call is responsible for creating and starting an application
 *
 * @author Thomas Messier
 * @singleton
 */
Ext.application({
	name: 'NP',
	requires: [
		'Ext.util.History'
		,'Ext.state.*'
		,'NP.lib.core.Net'
		,'NP.lib.core.Util'
		,'NP.lib.core.Config'
		,'NP.lib.core.Security'
	],
	
	// We only want to define the Viewport controller since it's always needed to run main navigation
	// Do not include any other controllers here, they will be lazy loaded as needed on dev
	controllers: [],

	// This is to track controllers that have already been initialized to make sure we don't initialize
	// them twice
	initializedControllers: {},

	/**
     * @private
	 * @param {Ext.app.Application} app The application object for the app being launched
	 */
	launch: function(app) {
		var that = this;
		
		// Start loading the minimum inital data we need to be able to run the application
		this.loadInitialData().then({
			success: function(res) {
				// Language to load; static for now, will be updated in future when we offer more languages
				var lang = 'en';
				var time = new Date().getTime();
				// Inject the correct file for localization
				Ext.Loader.injectScriptElement('app/locale/'+lang+'.js?_dc='+time, function() {
					// Initialize the viewport controller
					that.initController('Viewport');

					// Create the ViewPort
					Ext.create('NP.view.Viewport');
					
					// Init the history module so we can use the back and forward buttons
					that.initHistory();
					 
					// Initialize state manager
					Ext.state.Manager.setProvider( Ext.create('NP.lib.core.DBProvider') );
					
					// Initialize the UI state so that we start on whatever page is in the URL fragment
					that.initState();
				});
			},
			failure: function(error) {
				Ext.log(error);
			}
		});
	},
   	
	/**
	 * Loads initial data using other classes that is needed to run the application
     * @private
	 * @return  {Deft.promise.Promise}
	 */
    loadInitialData: function() {
    	return Deft.Promise.all([NP.lib.core.Security.loadPermissions(),NP.lib.core.Config.loadConfigSettings()]);
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
			if (userHash == CryptoJS.SHA1(NP.lib.core.Security.getUser().userprofile_id+'') && tokenHash == CryptoJS.SHA1(newToken)) {
				var args = newToken.split(':');
				this.runAction.apply(this, args);
			} else {
				console.log('Booting to the home page');
				this.addHistory('Viewport:home');
			}
		} else {
			this.runAction('Viewport', 'home');
		}
	},
    
    /**
     * Calls a controller's init() method if it hasn't already been initialized
     * @private
     * @param {String} controller The name of the controller
     */
	initController: function(controller) {
		if (!this.initializedControllers[controller]) {
			this.getController(controller).init();
			this.initializedControllers[controller] = true;
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
			var userIdHash = CryptoJS.SHA1(NP.lib.core.Security.getUser().userprofile_id+'');
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
		
		this.initController(controller);
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
     * @param {Ext.Component/String} view  The component to add to a panel if it's not already its first child
     * @param {String}               panel Any selector that can be used by Ext.ComponentQuery to get a container
     */
	setView: function(view, panel) {
		var sameView = false;
		// If a string was passed in, create a view object first
		if (typeof view == 'string') {
			// Get the currently active view
			var currentView = this.getCurrentView();

			// Only create the view if dealing with a different one than the currently active one
			if (Ext.ClassManager.getName(currentView) != view) {
				view = Ext.create(view);
			// otherwise just use the active view instead of re-creating it
			} else {
				sameView = true
			}
		}
		// If we have a new view, let's add it to the parent panel
		if (!sameView) {
			if (arguments.length == 1) {
				panel = '#contentPanel';
				view.region = 'center';
			}
			var pnl = Ext.ComponentQuery.query(panel)[0];
			pnl.removeAll();
			pnl.add(view);
		}
	},
	
	/**
	 * Utility function to return the first child view in the main content panel
	 * @return {Ext.container.Container}
	 */
	getCurrentView: function() {
		return Ext.ComponentQuery.query('#contentPanel')[0].child();
	}
	
});