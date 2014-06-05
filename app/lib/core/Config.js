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
	 * @property {Int}
	 * Stores the client ID
	 */
	var clientId = null;
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
		
		requires: [
			'NP.lib.core.Net'
		],

		/**
		 * Gets the name of the app
		 * @return {String}
		 */
		getAppName: function() {
			return appName;
		},

		setAppName: function(name) {
			appName = name;
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

		setSettings: function(val) {
			settings = val;
		},
		
		setClientId: function(id) {
			clientId = id;
		},

		getClientId: function() {
			return clientId;
		},
		
		/**
		 * Returns all custom field configuration settings
		 * @return {Object}
		 */
		getCustomFields: function() {
			return customFields;
		},

		setCustomFields: function(val) {
			customFields = val;
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
			return NP.Config.getSetting('PN.Intl.DateFormat', 'm/d/Y');
		},
		
		/**
		 * Returns the default date format used when displaying dates in the app
		 * @return {String}
		 */
		getDefaultDateTimeFormat: function() {
			return NP.Config.getDefaultDateFormat() + ' h:ia';
		},

		/**
		 * Returns all settings for the currently logged in user
		 * @return {Object}
		 */
		getUserSettings: function() {
			return userSettings;
		},

		setUserSettings: function(val) {
			userSettings = val;
		},

		/**
		 * Saves a user setting to the database via an ajax request
		 * @param  {String} name  Name of the setting
		 * @param  {Mixed}  value Value for the setting
		 */
		saveUserSetting: function(name, value, callback) {
			NP.lib.core.Net.remoteCall({
				method  : 'POST',
	            requests: {
	                service: 'UserService', 
	                action: 'saveSetting',
	                name:   name,
	                value:  Ext.JSON.encode(value),
	                success: function(result) {
						userSettings[name] = value;

	                    Ext.log('Setting was saved');

	                	if (callback) {
	                		callback();
	                	}
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
		},

		setTimezoneAbr: function(val) {
			timezone = val;
		}
	}
}());
