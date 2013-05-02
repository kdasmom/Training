/**
 * The MySettings controller deals with operations in the My Settings section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.MySettings', {
	extend: 'Ext.app.Controller',
	
	requires: ['NP.lib.core.Security','NP.lib.core.Net','NP.lib.core.Util'],
	
	init: function() {
		Ext.log('MySettings controller initialized');

		var app = this.application;

		// Setup event handlers
		this.control({
			'[xtype="mysettings.main"]': {
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('MySettings onTabChange() running');
					
					var activeTab = Ext.getClassName(newCard).split('.').pop();
					this.application.addHistory('MySettings:showMySettings:' + activeTab);
				}
			},
			'[xtype="mysettings.userinformation"]': {
				dataloaded: function(formPanel, data) {
					// Select properties in item selector
					var userProps = Ext.getStore('user.Properties').getRange();
					formPanel.getForm().findField('user_properties').setValue(userProps);
				}
			},
			'[xtype="mysettings.userinformation"] [xtype="shared.button.save"]': {
				click: this.submitUserInfo
			}
		});

		// Load the Security Questions store
		this.application.loadStore('system.SecurityQuestions', 'NP.store.system.SecurityQuestions');

		// Load the Property store
		this.application.loadStore('property.AllProperties', 'NP.store.property.Properties', {
			service: 'PropertyService',
			action : 'getAllForSettings'
		});
	},
	
	/**
	 * Shows the my settings page
	 * @param {String} [activeTab="open"] The tab currently active
	 */
	showMySettings: function(activeTab) {
		// Set the MySettings view
		var tabPanel = this.application.setView('NP.view.mySettings.Main');

		// If no active tab is passed, default to Open
		if (!activeTab) var activeTab = 'Overview';
		
		// Check if the tab to be selected is already active, if it isn't make it the active tab
		var tab = this.application.getComponent('mysettings.' + activeTab.toLowerCase());
		
		// Set the active tab if it hasn't been set yet
		if (tab.getXType() != tabPanel.getActiveTab().getXType()) {
			tabPanel.setActiveTab(tab);
		}

		// Check if there's a show method for this tab
		var showMethod = 'show' + activeTab;
		if (this[showMethod]) {
			// If the show method exists, run it
			this[showMethod](tab);
		}
	},

	submitUserInfo: function() {
		var form = this.application.getComponent('mysettings.userinformation');
		
		if (form.isValid()) {
			form.submitWithBindings({
				service: 'UserService',
				action : 'saveUserInfo',
				extraFields: {
					userprofile_password_current: 'userprofile_password_current',
					userprofile_password_confirm: 'userprofile_password_confirm',
					user_properties             : 'user_properties'
				},
				success: function(result, deferred) {
					// Clear passsord fields after save
					if (form.findField('userprofile_password_current')) {
						form.findField('userprofile_password_current').setValue('');
					}
					form.findField('userprofile_password').setValue('');
					form.findField('userprofile_password_confirm').setValue('');

					// Show info message
					NP.Util.showFadingWindow({ html: 'Changes saved successfully' });
				}
			});
		}
	}
});