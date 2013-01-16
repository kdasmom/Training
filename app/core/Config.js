Ext.define('NP.core.Config', function() {
	// Private variables
	var settings = null;
	var customFields = null;
	
	return {
		singleton: true,
		
		requires: ['NP.core.Net'],
		
		loadConfigSettings: function(callback) {
			Ext.log('Loading config settings');
			
			var deferred = Ext.create('Deft.Deferred');
			
			NP.core.Net.remoteCall({
				requests: [
					// This request gets config settings for the app
					{
						service: 'system.ConfigService', 
						action: 'getAll',
						success: function(result) {
							// Save settings in application
							settings = result;
							
							// Set the default currency sign
							Ext.apply(Ext.util.Format, {
					            currencySign: NP.core.Config.getSetting('PN.Intl.currencySymbol')
					        });
						}
					},
					// This request gets custom field config for the app
					{ 
						service: 'system.ConfigService', 
						action: 'getCustomFields',
						success: function(result) {
							// Save custom fields in application
							customFields = result;
						}
					}
				],
				success: function(results) {
					deferred.resolve(results);
					callback();
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
		}
	}
});
