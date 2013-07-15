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
	 * @property {String}
	 * Stores the app name
	 */
	var appName = null;
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
	
	/**
	 * @private
	 * @property {String}
	 * Stores the timezone abbreviation
	 */
	var timezone = null;
	
	return {
		alternateClassName: 'NP.Config',
		
		singleton: true,
		
		requires: ['NP.lib.core.Net','NP.store.system.States','NP.store.system.Countries'],
		
		/**
		 * Loads all application configuration settings, custom field settings, and user settings with
		 * one ajax request. This function runs at application startup.
		 * @return {Deft.Promise}
		 */
		loadConfigSettings: function() {
			Ext.log('Loading config settings');
			
			// Create the state store
			Ext.create('NP.store.system.States', { storeId: 'system.States' });
			
			// Create the country store
			Ext.create('NP.store.system.Countries', { storeId: 'system.Countries' });

			// Make the ajax request
			return NP.lib.core.Net.remoteCall({
				requests: [
					// This request gets the app name
					{
						service: 'ConfigService', 
						action: 'getAppName',
						success: function(result) {
							// Save app name in application
							appName = result;
						}
					},
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
						action: 'getInvoicePoCustomFields',
						success: function(result) {
							// Save custom fields in application
							customFields = result;
						}
					},
					// This request gets all integration packages for the app
					{ 
						service: 'ConfigService',
						action : 'getIntegrationPackages',
						store  : 'NP.store.system.IntegrationPackages',
						storeId: 'system.IntegrationPackages'
					},
					// This request gets all integration packages for the app
					{ 
						service: 'PropertyService',
						action : 'getFiscalDisplayTypes',
						store  : 'NP.store.property.FiscalDisplayTypes',
						storeId: 'property.FiscalDisplayTypes'
					},
					// This request gets all regions for the app
					{ 
						service: 'PropertyService',
						action : 'getRegions',
						store  : 'NP.store.property.Regions',
						storeId: 'property.Regions'
					},
					// This request gets all unit type measurement options for the app
					{ 
						service: 'PropertyService',
						action : 'getUnitTypeMeasurements',
						store  : 'NP.store.property.UnitTypeMeasurements',
						storeId: 'property.UnitTypeMeasurements'
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
					// This request gets config settings for the user
					{
						service: 'ConfigService', 
						action: 'getTimezoneAbr',
						success: function(result) {
							// Save timezone
							timezone = result;
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

		/**
		 * Gets the name of the app
		 * @return {String}
		 */
		getAppName: function() {
			return appName;
		},
		
		/**
		 * Gets the value of an application setting
		 * @param  {String} name            Name of the setting to retrieve
		 * @param  {Mixed}  [defaultVal=""] Default value to return in case the setting doesn't exist
		 * @return {Mixed}
		 */
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
		
		/**
		 * Sets the value of an application setting
		 * @param  {String} name            Name of the setting to retrieve
		 * @param  {Mixed}  [value=""] 		Value that should be set for setting
		 * @return {Boolean}
		 */
		setSetting: function(name, value) {
			name = name.toLowerCase();
			if (arguments.length < 2) {
				Ext.log('No value provided for setting ' + name);
				return false;
			}
			
			if(settings[name] = value){
				return true;
			}
		},
		
		
		/**
		 * Returns all custom field configuration settings
		 * @return {Object}
		 */
		getCustomFields: function() {
			return customFields;
		},

		/**
		 * Shortcut for NP.Config.getSetting('PN.main.PropertyLabel', 'Property') and plural equivalent
		 * @param {Boolean} [isPlural=false] Whether or not you want the plural setting value or the singular one
		 */
		 getPropertyLabel: function(isPlural) {
		 	if (arguments.length == 0) {
		 		isPlural = false;
		 	}
		 	if (isPlural) {
		 		return NP.Config.getSetting('PN.Main.PropertiesLabel', 'Properties');
		 	} else {
		 		return NP.Config.getSetting('PN.main.PropertyLabel', 'Property');
		 	}
		 },
		
		/**
		 * Returns the date format mask that the server returns dates as
		 * @return {String}
		 */
		getServerDateFormat: function() {
			return 'Y-m-d H:i:s.u';
		},
		
		/**
		 * Returns the date format mask that the server returns dates as for smalldatetime
		 * @return {String}
		 */
		getServerSmallDateFormat: function() {
			return 'Y-m-d H:i:s';
		},
		
		/**
		 * Returns the default date format used when displaying dates in the app
		 * @return {String}
		 */
		getDefaultDateFormat: function() {
			return 'm/d/Y';
		},

		/**
		 * Returns all settings for the currently logged in user
		 * @return {Object}
		 */
		getUserSettings: function() {
			return userSettings;
		},

		/**
		 * Saves a user setting to the database via an ajax request
		 * @param  {String} name  Name of the setting
		 * @param  {Mixed}  value Value for the setting
		 * @return {Deft.Promise}
		 */
		saveUserSetting: function(name, value) {
			return NP.lib.core.Net.remoteCall({
	            requests: {
	                service: 'UserService', 
	                action: 'saveSetting',
	                name:   name,
	                value:  Ext.JSON.encode(value),
	                success: function(result, deferred) {
	                    Ext.log('Setting was saved');
	                	deferred.resolve();
	                },
	                failure: function(response, options, deferred) {
	                    Ext.log('Setting could not be saved');
	                	deferred.reject('Setting could not be saved');
	                }
	            }
	        });
		},

		/**
		 * Returns the background color used for non default toolbars
		 * @return {String}
		 */
		getToolbarBg: function() {
			return '#DFE8F6';
		},

		/**
		 * Returns the timezone abbreviation
		 * @return {String}
		 */
		getTimezoneAbr: function() {
			return timezone;
		}
	}
}());
