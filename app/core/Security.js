Ext.define('NP.core.Security', function() {
	var permissions = null;
	var user = null;
	
	return {
		singleton: true,
		
		requires: ['NP.core.Net','NP.model.Userprofile'],
		
		loadpermissions: function(callback) {
			Ext.log('Loading permissions');
			
			var deferred = Ext.create('Deft.Deferred');
			
			NP.core.Net.remoteCall({
				requests: [
					{
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
					},
					{
						service: 'system.SecurityService', 
						action: 'getUser',
						success: function(result) {
							user = Ext.create('NP.model.Userprofile', result);
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

		hasPermission: function(module_id) {
			if (module_id in permissions) {
				return true;
			}
			
			return false;
		}
	}
}());