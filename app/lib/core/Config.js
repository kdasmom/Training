Ext.define('NP.lib.core.Config', function() {
	// Private variables
	var settings = null;
	var userSettings = null;
	var customFields = null;
	
	return {
		singleton: true,
		
		requires: ['NP.lib.core.Net'],
		
		loadConfigSettings: function() {
			Ext.log('Loading config settings');
			
			var deferred = Ext.create('Deft.Deferred');
			
			NP.lib.core.Net.remoteCall({
				requests: [
					// This request gets config settings for the app
					{
						service: 'ConfigService', 
						action: 'getAll',
						success: function(result) {
							// Save settings in application
							settings = result;
							
							// Set the default currency sign
							Ext.apply(Ext.util.Format, {
					            currencySign: NP.lib.core.Config.getSetting('PN.Intl.currencySymbol')
					        });
						}
					},
					// This request gets config settings for the user
					{
						service: 'UserService', 
						action: 'getSettings',
						success: function(result) {
							// Save user settings in application
							userSettings = {};
							Ext.each(result, function(item, idx) {
								userSettings[item['usersetting_name']] = Ext.JSON.decode(item['usersetting_value']);
							});
						}
					},
					// This request gets custom field config for the app
					{ 
						service: 'ConfigService', 
						action: 'getCustomFields',
						success: function(result) {
							// Save custom fields in application
							customFields = result;
						}
					}
				],
				success: function(results) {
					deferred.resolve(results);
				},
				failure: function() {
					Ext.log('Could not load config data');
					deferred.reject('Could not load config data');
				}
			});
			
			return deferred.promise;
		},
		
		getSetting: function(name, defaultVal) {
			name = name.toLowerCase();
			if (arguments.length < 2) {
				defaultVal = '';
			}
			if (name in settings) {
				return settings[name];
			} else {
				return defaultVal;
			}
		},
		
		getCustomFields: function() {
			return customFields;
		},
		
		getServerDateFormat: function() {
			return 'Y-m-d H:i:s.u';
		},
		
		getDefaultDateFormat: function() {
			return 'm/d/Y';
		},

		getUserSettings: function() {
			return userSettings;
		},

		saveUserSetting: function(name, value) {
			NP.lib.core.Net.remoteCall({
	            requests: {
	                service: 'UserService', 
	                action: 'saveSetting',
	                name:   name,
	                value:  Ext.JSON.encode(value),
	                success: function() {
	                    console.log('Setting was saved');
	                },
	                failure: function() {
	                    console.log('Setting could not be saved');
	                }
	            }
	        });
		}
	}
}());
