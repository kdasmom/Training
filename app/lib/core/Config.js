/**
 * The Config class is used to control everything that relates to configuration settings, either at the
 * application level or the user level.
 *
 * @author Thomas Messier
 * @singleton
 * @requires NP.lib.core.Net
 */
Ext.define('NP.lib.core.Config', function() {
	/**
	 * @private
	 * @property {Array}
	 * Stores the application settings
	 */
	var settings = null;
	
	/**
	 * @private
	 * @property {Array}
	 * Stores custom field settings
	 */
	var customFields = null;
	
	/**
	 * @private
	 * @property {Array}
	 * Stores the user settings
	 */
	var userSettings = null;
	
	return {
		singleton: true,
		
		requires: ['NP.lib.core.Net'],
		
		/**
		 * Loads all application configuration settings, custom field settings, and user settings with
		 * one ajax request and uses the results to set
		 * @return {Deft.Promise}
		 */
		loadConfigSettings: function() {
			Ext.log('Loading config settings');
			
			// Make the ajax request
			return NP.lib.core.Net.remoteCall({
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
					// This request gets custom field config for the app
					{ 
						service: 'ConfigService', 
						action: 'getCustomFields',
						success: function(result) {
							// Save custom fields in application
							customFields = result;
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
					}
				],
				success: function(results, deferred) {
					// If all ajax requests are successful, resolve the deferred
					deferred.resolve(results);
				},
				failure: function(response, options, deferred) {
					Ext.log('Could not load config data');
					// If any of the ajax requests fails, reject the deferred
					deferred.reject('Could not load config data');
				}
			});
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
