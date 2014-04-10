/**
 * The DataLoader class is in charge of loading data at startup time and at intervals.
 *
 * @author Thomas Messier
 * @singleton
 */
Ext.define('NP.lib.core.DataLoader', {
	singleton: true,
		
	requires: [
		'NP.lib.core.Net',
		'NP.lib.core.Config',
		'NP.lib.core.Security',
		'NP.store.property.Regions',
		'NP.store.property.Properties',
		'NP.store.system.States',
		'NP.store.system.Months',
		'NP.store.system.Countries',
		'NP.store.security.ModuleTree',
		'NP.store.system.Tiles',
		'NP.store.system.SummaryStats',
		'NP.store.system.SummaryStatCategories',
		'NP.store.system.IntegrationPackages',
		'NP.store.property.Units',
		'NP.store.property.FiscalDisplayTypes',
		'NP.store.gl.GlAccounts',
		'NP.store.property.UnitTypeMeasurements',
		'NP.store.user.RoleTree',
		'NP.model.user.Role',
		'NP.store.user.Delegations'
	],

	loadStartupData: function(callback) {
		Ext.log('Loading init settings');

		// Create the state store
		Ext.create('NP.store.system.States', { storeId: 'system.States' });

		// Create the month store
		Ext.create('NP.store.system.Months', { storeId: 'system.Months' });
		
		// Create the country store
		Ext.create('NP.store.system.Countries', { storeId: 'system.Countries' });
		
		// Create the Summary Stat Categories store
		Ext.create('NP.store.system.SummaryStatCategories', { storeId: 'system.SummaryStatCategories' });

		// Create the Summary Stat store
		Ext.create('NP.store.system.SummaryStats', { storeId: 'system.SummaryStats' });

		// Create the Tiles store
		Ext.create('NP.store.system.Tiles', { storeId: 'system.Tiles' });

		// Make the ajax request
		NP.lib.core.Net.remoteCall({
			method  : 'POST',
			requests: [
				// This request gets the app name
				{
					service: 'ConfigService', 
					action: 'getAppName',
					success: function(result) {
						// Save app name in application
						NP.Config.setAppName(result);
					}
				},
				// This request gets the app name
				{
					service: 'ConfigService', 
					action: 'getClientId',
					success: function(result) {
						// Save app name in application
						NP.Config.setClientId(result);
					}
				},
				// This request gets config settings for the app
				{
					service: 'ConfigService', 
					action: 'getAll',
					success: function(result) {
						// Save settings in application
						NP.Config.setSettings(result);
						
						// Set the default currency sign
						Ext.apply(Ext.util.Format, {
				            currencySign: NP.Config.getSetting('PN.Intl.currencySymbol')
				        });
					}
				},
				// This request gets custom field config for the app
				{ 
					service: 'ConfigService', 
					action: 'getInvoicePoCustomFields',
					success: function(result) {
						// Save custom fields in application
						NP.Config.setCustomFields(result);
					}
				},
				// This request gets all integration packages for the app
				{ 
					service: 'ConfigService',
					action : 'getIntegrationPackages',
					store  : 'NP.store.system.IntegrationPackages',
					storeId: 'system.IntegrationPackages'
				},
				// This request gets all properties in the app
				{ 
					service: 'PropertyService',
					action : 'getAll',
					store  : 'NP.store.property.Properties',
					storeId: 'property.AllProperties'
				},
				// This request gets all units in the app
				{ 
					service: 'PropertyService',
					action : 'getAllUnits',
					store  : 'NP.store.property.Units',
					storeId: 'property.AllUnits'
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
				// This request gets all properties in the app
				{ 
					service: 'GLService',
					action : 'getAll',
					store  : 'NP.store.gl.GlAccounts',
					storeId: 'gl.AllGlAccounts'
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
						var userSettings = {};
						Ext.each(result, function(item, idx) {
							userSettings[item['usersetting_name']] = Ext.JSON.decode(item['usersetting_value']);
						});

						NP.Config.setUserSettings(userSettings);
					}
				},
				// This request gets config settings for the user
				{
					service: 'ConfigService', 
					action: 'getTimezoneAbr',
					success: function(result) {
						// Save timezone
						NP.Config.setTimezoneAbr(result);
					}
				},
				// This requests gets the tree for all the roles in the system
				{ 
					service: 'UserService',
					action : 'getRoleTree',
					store  : 'NP.store.user.RoleTree',
					storeId: 'user.RoleTree'
				},
				// Load user permissions
				{
					service: 'SecurityService', 
					action: 'getPermissions',
					success: function(result) {
						// Save permissions
						NP.Security.setPermission(result);
					},
					failure: function() {
						Ext.log('Could not load permissions')
					}
				},
				// Get the logged in user
				{
					service: 'SecurityService', 
					action: 'getUser',
					success: function(result) {
						// Save the current user
						NP.Security.setUser(Ext.create('NP.model.user.Userprofile', result));
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
						NP.Security.setDelegatedToUser(Ext.create('NP.model.user.Userprofile', result));
					},
					failure: function() {
						Ext.log('Could not load delegated to user');
					}
				},
				// Get the logged in user's role
				{
					service: 'SecurityService', 
					action: 'getRole',
					success: function(result) {
						// Save the current user
						NP.Security.setRole(Ext.create('NP.model.user.Role', result));
					},
					failure: function() {
						Ext.log('Could not load user');
					}
				},
				// Get the logged in user's property context
				{
					service: 'SecurityService', 
					action: 'getContext',
					success: function(result) {
						// Save the current user
						NP.Security.setCurrentContextNoAjax(result);
					},
					failure: function() {
						Ext.log('Could not load property context');
					}
				},
				// Get module tree
				{ 
					service                    : 'SecurityService',
					action                     : 'getModuleTree',
					store                      : 'NP.store.security.ModuleTree',
					storeId                    : 'security.ModuleTree'
				}
			],
			success: function(results) {
				// We need to run a second ajax request to get some settings that depend on the user info
				NP.lib.core.Net.remoteCall({
					requests: [
						// This request gets regions for the user
						{ 
							service                    : 'UserService',
							action                     : 'getUserRegions',
							store                      : 'NP.store.property.Regions',
							storeId                    : 'user.Regions',
							userprofile_id             : NP.Security.getUser().get('userprofile_id'),
							delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id')
						},
						// This request gets properties for the user
						{ 
							service                    : 'UserService',
							action                     : 'getUserProperties',
							store                      : 'NP.store.property.Properties',
							storeId                    : 'user.Properties',
							userprofile_id             : NP.Security.getUser().get('userprofile_id'),
							delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
							property_statuses          : '1,-1'
						},
						// This request gets delegations for the user
						{ 
							service          : 'UserService',
							action           : 'getDelegationsTo',
							store            : 'NP.store.user.Delegations',
							storeId          : 'user.Delegations',
							userprofile_id   : NP.Security.getDelegatedToUser().get('userprofile_id'),
							delegation_status: 1,
							success: function(store) {
								var currentUser = NP.Security.getDelegatedToUser();

					    		store.insert(0, {
									userprofile_username: currentUser.get('userprofile_username'),
									UserProfile_Id      : currentUser.get('userprofile_id')
					    		});
							}
						}
					],
					success: function(results) {
						callback(results);
					},
					failure: function(response, options) {
						throw 'Could not load additional startup data';
					}
				});
			},
			failure: function(response, options) {
				throw 'Could not load startup data';
			}
		});
	}
});