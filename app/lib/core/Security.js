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
	
	// Store this configuration for an ajax request to avoid repetition as we need it in two places
	var getPermissionAjaxRequestConfig = {
		service: 'SecurityService', 
		action: 'getPermissions',
		success: function(result) {
			// Save permissions
			var modules = result.split(',');
			permissions = {};
			for (var i=0; i<modules.length; i++) {
				permissions[modules[i]] = true;
			}
		},
		failure: function() {
			Ext.log('Could not load permissions')
		}
	};

	// Add a global ajax event listener to boot user out if session has expired
	Ext.Ajax.addListener('requestcomplete', function(conn, response, options, eOpts) {
		if (response.responseText.indexOf('authenticationFailure') !== -1) {
			window.location = 'login.php';
			return false;
		}
	});

	return {
		singleton: true,
		
		requires: ['NP.lib.core.Net','NP.model.user.Userprofile'],
		
		/**
		 * Loads all permissions for logged in user and gets information for the logged in user
		 * and the user being delegated to. This function runs at application startup.
		 * @return {Deft.Promise}
		 */
		loadPermissions: function() {
			Ext.log('Loading permissions');
			
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
					}
				],
				success: function(results, deferred) {
					deferred.resolve(results);
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
			return NP.lib.core.Net.remoteCall({
				requests: { 
					service: 'SecurityService', 
					action: 'logout',
					success: function(result) {
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
		 * Checks if currently logged in user has rights to a certain module
		 * @param  {number} module_id
		 * @return {boolean}
		 */
		hasPermission: function(module_id) {
			if (module_id in permissions) {
				return true;
			}
			
			return false;
		},

		/**
		 * Changes the logged in user to a different user (used when there are active delegations)
		 * @param  {number}   userprofile_id ID of the user
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
		}
	}
}());