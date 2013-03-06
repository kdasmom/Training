Ext.Loader.setConfig({
	enabled: true
});

Ext.application({
	name: 'NP',
	paths: {
		Ux:	'./app/extensions'
		,Skirtle: './app/extensions/ui'
		,'Ext.ux': './app/extensions/ui'
	},
	requires: [
		'Ext.util.History'
		,'Ext.state.*'
		,'NP.core.Net'
		,'NP.core.Util'
		,'NP.core.Config'
		,'NP.core.Security'
		,'Ext.util.Format'
	],
    
	controllers: ['Viewport','Invoice'],

	stores: ['user.Delegations'],

	launch: function(application) {
		var that = this;
		
		this.loadInitialData(function() {
			// Create the ViewPort
			Ext.create('NP.view.Viewport');
			
			// Init the history module so we can use the back and forward buttons
			that.initHistory();
			 
			// Initialize state manager
			Ext.state.Manager.setProvider( Ext.create('NP.core.DBProvider') );
			
			that.initState();
		});
		
		/*
		this.loadInitialData().then({
			success: function(res) {
				// Create the ViewPort
				Ext.create('NP.view.Viewport');
				
				// Init the history module so we can use the back and forward buttons
				that.initHistory();
				 
				// Initialize state manager
				Ext.state.Manager.setProvider( Ext.create('Ext.state.CookieProvider') );
				
				that.initState();
			},
			failure: function(error) {
				Ext.log(error);
			}
		});
		*/
	},
    
	initHistory: function() {
		Ext.log('Initializing Ext.History');
		
		Ext.History.init();
		 
		var app = this;
		Ext.History.on('change', function(token) {
			Ext.log('History has changed to ' + token);
			app.gotoToken(token);
		});
	},
   
	loadInitialData: function(callback) {
		var that = this;
		// Language to load; static for now, will be updated in future when we offer more languages
		var lang = 'en';
		
		NP.core.Config.loadConfigSettings(function() {
			NP.core.Security.loadPermissions(function() {
				var time = new Date().getTime();
				Ext.Loader.injectScriptElement('app/locale/'+lang+'.js?_dc='+time, function() {
					that.getStore('user.Delegations').load(function() {
						callback();
					});
				});
			});
		});
    },
   
    /*
    loadInitialData: function() {
    	return Deft.Promise.all([NP.core.Config.loadConfigSettings(), NP.core.Security.loadPermissions()]);
    },
    */
   
	initState: function() {
		var token = Ext.History.getToken();
		Ext.log('Initial token: ' + token);
		
		this.gotoToken(token);
	},
    
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
			if (userHash == CryptoJS.SHA1(NP.core.Security.getUser().get('userprofile_id')+'') && tokenHash == CryptoJS.SHA1(newToken)) {
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
    
	setView: function(view, panel) {
		// If a string was passed in, create a view object first
		if (typeof view == 'string') {
			view = Ext.create(view);
		}
		if (arguments.length == 1) {
			panel = 'contentPanel';
			view.region = 'center';
		}
		var pnl = Ext.ComponentQuery.query('#'+panel);
		pnl[0].removeAll();
		pnl[0].add(view);
	},
    
	addHistory: function(newToken) {
		var oldToken = Ext.History.getToken();
		
		if (oldToken === null || oldToken !== newToken) {
			// Hash the entire token
			var tokenHash = CryptoJS.SHA1(newToken);
			var userIdHash = CryptoJS.SHA1(NP.core.Security.getUser().get('userprofile_id')+'');
			Ext.History.add(newToken+':'+tokenHash + ':' + userIdHash);
		}
	},
	
	getCurrentView: function() {
		return Ext.ComponentQuery.query('#contentPanel')[0].child();
	},
	
	getCurrentViewId: function() {
		return this.getCurrentView().getId();
	},
	
	getCurrentViewType: function() {
		return this.getCurrentView().getXType();
	},
	
	getPropertyFilterState: function() {
		return Ext.ComponentQuery.query('viewport.toptoolbar')[0].getState();
	},

	remoteCall: function(cfg) {
		NP.core.Net.remoteCall(cfg);
	},

	
});