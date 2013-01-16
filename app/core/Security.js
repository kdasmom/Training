Ext.define('NP.core.Security', function() {
	var permissions = null;
	
	return {
		singleton: true,
		
		requires: ['NP.core.Net'],
		
		loadpermissions: function(callback) {
			Ext.log('Loading permissions');
			
			var deferred = Ext.create('Deft.Deferred');
			
			NP.core.Net.remoteCall({
				requests: { 
					service: 'system.SecurityService', 
					action: 'getPermissions',
					success: function(result) {
						// Save permissions
						var modules = result.split(',');
						permissions = {};
						for (var i=0; i<modules.length; i++) {
							permissions[modules[i]] = true;
						}
						
						deferred.resolve(result);
						callback();
					},
					failure: function() {
						Ext.log('Could not load permissions')
						deferred.reject('Could not load permissions');
					}
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
		
		hasPermission: function(module_id) {
			if (module_id in permissions) {
				return true;
			}
			
			return false;
		}
	}
});