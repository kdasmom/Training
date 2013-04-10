/**
 * The Admin controller deals with operations in the Administration section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.Admin', {
	extend: 'Ext.app.Controller',
	
	requires: ['NP.lib.core.Security','NP.lib.core.Net','NP.lib.core.Util'],
	
	init: function() {
		Ext.log('Admin controller initialized');

		var app = this.application;

		// Setup event handlers
		this.control({
			'[xtype="admin.mysettings"]': {
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('MySettings onTabChange() running');
					
					var activeTab = Ext.getClassName(newCard).split('.').pop();
					this.application.addHistory('Admin:showMySettings:' + activeTab);
				}
			},
			'[xtype="admin.mysettings.userinformation"]': {
				dataloaded: function(formPanel, data) {
					// Select properties in item selector
					var userProps = Ext.getStore('user.Properties').getRange();
					formPanel.getForm().findField('user_properties').setValue(userProps);
				}
			},
			'[xtype="admin.mysettings.userinformation"] [xtype="shared.button.save"]': {
				click: this.submitUserInfo
			}
		});

		// Load the Security Questions store
		this.application.loadStore('NP.store.system.SecurityQuestions', 'system.SecurityQuestions');

		// Load the Property store
		this.application.loadStore('NP.store.property.Properties', 'property.AllProperties', {
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
		this.application.setView('NP.view.admin.MySettings');

		// If no active tab is passed, default to Open
		if (!activeTab) var activeTab = 'Overview';
		
		// Check if the tab to be selected is already active, if it isn't make it the active tab
		var tab = this.application.getComponent('admin.mysettings.' + activeTab.toLowerCase());
		var tabPanel = this.application.getComponent('admin.mysettings');
		
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
		var form = this.application.getComponent('admin.mysettings.userinformation');
		
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