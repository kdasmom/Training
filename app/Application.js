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
		,'Ext.util.History'
		,'Ext.state.*'
		,'NP.core.Net'
		,'NP.core.Util'
		,'NP.core.Config'
		,'NP.core.Security'
		,'Ext.util.Format'
	],
    
	controllers: ['Viewport','Invoice'],

	launch: function(application) {
		var that = this;
		
		this.loadInitialData(function() {
			// Create the ViewPort
			Ext.create('NP.view.Viewport');
			
			// Init the history module so we can use the back and forward buttons
			that.initHistory();
			 
			// Initialize state manager
			Ext.state.Manager.setProvider( Ext.create('Ext.state.CookieProvider') );
			
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
			app.gotoToken(token);
		});
	},
   
	loadInitialData: function(callback) {
		NP.core.Config.loadConfigSettings(function() {
			NP.core.Security.loadpermissions(callback)
		});
    },
   
    /*
    loadInitialData: function() {
    	return Deft.Promise.all([NP.core.Config.loadConfigSettings(), NP.core.Security.loadpermissions()]);
    },
    */
   
	initState: function() {
		var token = Ext.History.getToken();
		Ext.log('Initial token: ' + token);
		
		this.gotoToken(token);
	},
    
	gotoToken: function(token) {
		Ext.log('Going to token: ' + token);
		if (token) {
			var args = token.split(':');
			this.runAction.apply(this, args);
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
			Ext.History.add(newToken);
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
		return Ext.ComponentQuery.query('toptoolbar')[0].getState();
	},

	remoteCall: function(cfg) {
		var that = this;
		// Add the default authentication failure function if none is defined
		Ext.applyIf(cfg, {
			authenticationFailure: function() {
				that.runAction('Viewport', 'showLogin');
			}
		});
		NP.core.Net.remoteCall(cfg);
	}
});