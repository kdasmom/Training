Ext.define('NP.core.Security', function() {
	var permissions = null;
	var user = null;
	var delegatedToUser = null;
	
	var getPermissionAjaxRequestConfig = {
		service: 'system.SecurityService', 
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
		
		requires: ['NP.core.Net','NP.model.user.Userprofile'],
		
		loadPermissions: function(callback) {
			Ext.log('Loading permissions');
			
			var deferred = Ext.create('Deft.Deferred');
			
			NP.core.Net.remoteCall({
				requests: [
					getPermissionAjaxRequestConfig,
					{
						service: 'system.SecurityService', 
						action: 'getUser',
						success: function(result) {
							user = Ext.create('NP.model.user.Userprofile', result);
						},
						failure: function() {
							Ext.log('Could not load user');
						}
					},
					{
						service: 'system.SecurityService', 
						action: 'getDelegatedToUser',
						success: function(result) {
							delegatedToUser = Ext.create('NP.model.user.Userprofile', result);
						},
						failure: function() {
							Ext.log('Could not load user');
						}
					}
				],
				success: function(results) {
					callback();
					deferred.resolve(results);
				},
				failure: function() {
					Ext.log('Could not load security data');
					deferred.reject('Could not load security data');
				}
			});
			
			return deferred.promise;
		},
		
		logout: function(callback) {
			NP.core.Net.remoteCall({
				requests: { 
					service: 'system.SecurityService', 
					action: 'logout',
					success: function(result) {
						permissions = null;
						callback(result);
					}
				}
			});
		},
		
		getUser: function() {
			return user;
		},
		
		getDelegatedToUser: function() {
			return delegatedToUser;
		},

		hasPermission: function(module_id) {
			if (module_id in permissions) {
				return true;
			}
			
			return false;
		},

		changeUser: function(userprofile_id, callback) {
			NP.core.Net.remoteCall({
				requests: [
					{
						service       : 'system.SecurityService', 
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
				success: function() {
					callback();
				}
			});
		}
	}
}());