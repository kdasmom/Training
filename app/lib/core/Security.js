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
		
		requires: [
			'NP.lib.core.Net',
			'Ext.window.MessageBox'
		],
		
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
		 * Logs the user out
		 * @param  {Function} [callback] Function to call once logout is complete
		 */
		logout: function(callback) {
			NP.Net.remoteCall({
				requests: { 
					service: 'SecurityService', 
					action: 'logout',
					success: function(result) {
						permissions = null;
						
						if (callback) {
							callback(result);
						}
					},
					failure: function(response, options) {
						throw 'Could not log out';
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

		setUser: function(val) {
			user = val;
		},
		
		/**
		 * Returns user being delegated to by current logged in user
		 * @return {NP.model.user.Userprofile}
		 */
		getDelegatedToUser: function() {
			return delegatedToUser;
		},
		
		setDelegatedToUser: function(val) {
			delegatedToUser = val;
		},

		/**
		 * Returns role currently logged in
		 * @return {NP.model.user.Role}
		 */
		getRole: function() {
			return role;
		},

		setRole: function(val) {
			role = val;
		},

		/**
		 * Returns the permissions the logged in user has
		 * @return {Object}
		 */
		getPermissions: function() {
			return permissions;
		},

		setPermission: function(val) {
			permissions = val;
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
		 */
		changeUser: function(userprofile_id, callback) {
			NP.lib.core.Net.remoteCall({
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
					},{
						service: 'SecurityService', 
						action: 'getPermissions',
						success: function(result) {
							// Save permissions
							NP.Security.setPermission(result);
						},
						failure: function() {
							Ext.log('Could not load permissions')
						}
					}
				],
				success: function(result) {
					if (callback) {
						callback();
					}
				},
				failure: function(response, options) {
					throw 'Could not change user';
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

		setCurrentContextNoAjax: function(val) {
			currentContext = val;
		},

		/**
		 * Sets the property context for the user
		 * @param {Object}
		 */
		setCurrentContext: function(context) {
			currentContext = context;
			NP.lib.core.Net.remoteCall({
				abortable: false,
				requests : {
					service    : 'SecurityService',
					action     : 'setContext',
					type       : context.type,
					property_id: context.property_id,
					region_id  : context.region_id,
					failure    : function(response, options) {
						throw 'Failed to save context';
					}
				}
			});
		}
	}
}());