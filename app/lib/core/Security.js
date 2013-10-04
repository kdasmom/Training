/**
 * The Security class deals with anything security related, like loading permissions, logging out, etc.
 *
 * @author Thomas Messier
 * @singleton
 * @requires NP.lib.core.Net
 * @requires NP.model.user.Userprofile
 */
Ext.define('NP.lib.core.Security', function() {
	/**
	 * @private
	 * @property {Array}
	 * Stores the logged in user's permissions
	 */
	var permissions = null;
	
	/**
	 * @private
	 * @property {NP.model.user.Userprofile}
	 * Stores user currently logged in
	 */
	var user = null;
	
	/**
	 * @private
	 * @property {NP.model.user.Userprofile}
	 * Stores user currently being delegated to (if no delegation is happening, will be the same as user)
	 */
	var delegatedToUser = null;
	
	/**
	 * @private
	 * @property {NP.model.user.Role}
	 * Stores role currently logged in
	 */
	var role = null;
	
	/**
	 * @private
	 * @property {Object}
	 * Stores the property context user is currently logged into
	 */
	var currentContext = null;
	
	// Store this configuration for an ajax request to avoid repetition as we need it in two places
	var getPermissionAjaxRequestConfig = {
		service: 'SecurityService', 
		action: 'getPermissions',
		success: function(result) {
			// Save permissions
			permissions = result;
		},
		failure: function() {
			Ext.log('Could not load permissions')
		}
	};

	return {
		alternateClassName: 'NP.Security',

		singleton: true,
		
		requires: ['NP.lib.core.Net'],
		
		// For localization
		errorDialogTitleText: 'Error',
		errorText           : 'An unexpected error has occurred. Please contact your system administrator',

		constructor: function(cfg) {
			var that = this;

			// Global javascript error handler to pick up any error that isn't caught
			window.onerror = function(message, url, line) {
				// Display a generic alert to the user saying that an error happened
				Ext.MessageBox.alert(that.errorDialogTitleText, that.errorText);

				// Send the javascript error via Ajax since otherwise we can't log it from the client side
				var errorMsg = 'Url: ' + url + '\nLine: ' + line + '\nMessage: ' + message;
				NP.lib.core.Net.remoteCall({
					requests: {
						service  : 'LoggingService',
						action   : 'log',
						namespace: 'error',
						message  : errorMsg
					}
				});
			}
			
			// This is a global error handler for Ajax requests
			Ext.Ajax.on('requestexception', function (conn, response, options) {
				// Catch errors
				if (response.status === 500) {
			        Ext.MessageBox.alert(that.errorDialogTitleText, that.errorText);
			    // Catch requests made with expired/unauthenticated session
			    } else if (response.status === 403) {
			    	window.location = 'login.php';
			    	return false;
			    }
			});

			this.callParent(arguments);
		},

		/**
		 * Loads all permissions for logged in user and gets information for the logged in user
		 * and the user being delegated to. This function runs at application startup.
		 * @return {Deft.Promise}
		 */
		loadPermissions: function() {
			Ext.log('Loading permissions');
			
			var that = this;

			return NP.lib.core.Net.remoteCall({
				requests: [
					// Load user permissions
					getPermissionAjaxRequestConfig,
					// Get the logged in user
					{
						service: 'SecurityService', 
						action: 'getUser',
						success: function(result) {
							// Save the current user
							user = Ext.create('NP.model.user.Userprofile', result);

							// Set the default property/region
						},
						failure: function() {
							Ext.log('Could not load user');
						}
					},
					// Get the user being delegated to
					{
						service: 'SecurityService', 
						action: 'getDelegatedToUser',
						success: function(result) {
							// Save the user being delegated to by current user
							delegatedToUser = Ext.create('NP.model.user.Userprofile', result);
						},
						failure: function() {
							Ext.log('Could not load delegated to user');
						}
					},
					// Get the logged in user's role
					{
						service: 'SecurityService', 
						action: 'getRole',
						success: function(result) {
							// Save the current user
							role = Ext.create('NP.model.user.Role', result);
						},
						failure: function() {
							Ext.log('Could not load user');
						}
					},
					// Get the logged in user's property context
					{
						service: 'SecurityService', 
						action: 'getContext',
						success: function(result) {
							// Save the current user
							currentContext = result;
						},
						failure: function() {
							Ext.log('Could not load property context');
						}
					},
					// Get module tree
					{ 
						service                    : 'SecurityService',
						action                     : 'getModuleTree',
						store                      : 'NP.store.security.ModuleTree',
						storeId                    : 'security.ModuleTree'
					}
				],
				success: function(results, deferred) {
					// We need to run a second ajax request to get some settings that depend on the user info
					NP.lib.core.Net.remoteCall({
						requests: [
							// This request gets regions for the user
							{ 
								service                    : 'UserService',
								action                     : 'getUserRegions',
								store                      : 'NP.store.property.Regions',
								storeId                    : 'user.Regions',
								userprofile_id             : that.getUser().get('userprofile_id'),
								delegated_to_userprofile_id: that.getDelegatedToUser().get('userprofile_id')
							},
							// This request gets properties for the user
							{ 
								service                    : 'UserService',
								action                     : 'getUserProperties',
								store                      : 'NP.store.property.Properties',
								storeId                    : 'user.Properties',
								userprofile_id             : that.getUser().get('userprofile_id'),
								delegated_to_userprofile_id: that.getDelegatedToUser().get('userprofile_id')
							},
							// This request gets delegations for the user
							{ 
								service          : 'UserService',
								action           : 'getDelegationsTo',
								store            : 'NP.store.user.Delegations',
								storeId          : 'user.Delegations',
								userprofile_id   : that.getDelegatedToUser().get('userprofile_id'),
								delegation_status: 1,
								success: function(store) {
									var currentUser = that.getDelegatedToUser();

						    		store.insert(0, {
										userprofile_username: currentUser.get('userprofile_username'),
										UserProfile_Id      : currentUser.get('userprofile_id')
						    		});
								}
							}
						],
						success: function(results) {
							// Resolve the deferred to indicate Ajax request successful
							deferred.resolve(results);
						},
						failure: function(response, options, deferred) {
							Ext.log('Could not load user data');
							deferred.reject('Could not load user data');
						}
					});
				},
				failure: function(response, options, deferred) {
					Ext.log('Could not load security data');
					deferred.reject('Could not load security data');
				}
			});
		},
		
		/**
		 * Logs the user out
		 * @param  {Function} [callback] Function to call once logout is complete
		 * @return {Deft.Promise}
		 */
		logout: function(callback) {
			return NP.Net.remoteCall({
				requests: { 
					service: 'SecurityService', 
					action: 'logout',
					success: function(result, deferred) {
						permissions = null;
						deferred.resolve(result);
						if (callback) {
							callback(result);
						}
					},
					failure: function(response, options, deferred) {
						deferred.reject('Could not log out');	
					}
				}
			});
		},
		
		/**
		 * Returns user currently logged in
		 * @return {NP.model.user.Userprofile}
		 */
		getUser: function() {
			return user;
		},
		
		/**
		 * Returns user being delegated to by current logged in user
		 * @return {NP.model.user.Userprofile}
		 */
		getDelegatedToUser: function() {
			return delegatedToUser;
		},
		
		/**
		 * Returns role currently logged in
		 * @return {NP.model.user.Role}
		 */
		getRole: function() {
			return role;
		},

		/**
		 * Returns the permissions the logged in user has
		 * @return {Object}
		 */
		getPermissions: function() {
			return permissions;
		},

		/**
		 * Checks if currently logged in user has rights to a certain module
		 * @param  {Number} module_id
		 * @return {Boolean}
		 */
		hasPermission: function(module_id) {
			if (module_id in permissions) {
				return true;
			}
			
			return false;
		},

		/**
		 * Changes the logged in user to a different user (used when there are active delegations)
		 * @param  {Number}   userprofile_id ID of the user
		 * @param  {Function} [callback]     Function to call once user has been changed
		 * @return {Deft.Promise}
		 */
		changeUser: function(userprofile_id, callback) {
			return NP.lib.core.Net.remoteCall({
				requests: [
					{
						service       : 'SecurityService', 
						action        : 'changeUser',
						userprofile_id: userprofile_id,
						success: function(result) {
							user = Ext.create('NP.model.user.Userprofile', result);
						},
						failure       : function() {
							Ext.log('Could not change user')
						}
					},
					getPermissionAjaxRequestConfig
				],
				success: function(result, deferred) {
					deferred.resolve();
					if (callback) {
						callback();
					}
				},
				failure: function(response, options, deferred) {
					deferred.reject('Could not change user');	
				}
			});
		},

		/**
		 * Returns the property context for the user
		 * @return {Object}
		 */
		getCurrentContext: function() {
			return currentContext;
		},

		/**
		 * Sets the property context for the user
		 * @param {Object}
		 */
		setCurrentContext: function(context) {
			currentContext = context;
			NP.lib.core.Net.remoteCall({
				requests: {
					service    : 'SecurityService',
					action     : 'setContext',
					type       : context.type,
					property_id: context.property_id,
					region_id  : context.region_id,
					failure    : function(response, options, deferred) {
						Ext.log('Failed to save context');
					}
				}
			});
		}
	}
}());