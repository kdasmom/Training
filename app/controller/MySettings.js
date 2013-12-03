/**
 * The MySettings controller deals with operations in the My Settings section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.MySettings', {
	extend: 'NP.lib.core.AbstractController',
	
	requires: [
		'NP.lib.core.Security',
		'NP.lib.core.Net',
		'NP.lib.core.Util',
		'NP.lib.core.Config',
    	'NP.lib.core.Translator',
		'NP.view.shared.PortalCanvas'
	],
	
	models: ['user.Userprofile','user.Userprofilerole','user.Staff','contact.Person',
			'contact.Address','contact.Email'],

    stores: ['notification.EmailAlertTypes','system.SecurityQuestions',
    		'system.SummaryStatCategories'],

    views: ['mySettings.Main','user.UserDelegationMain'],

	refs: [
		{ ref: 'overviewTab', selector: '[xtype="mysettings.overview"]' },
		{ ref: 'userInformationTab', selector: '[xtype="mysettings.userinformation"]' },
		{ ref: 'settingsTab', selector: '[xtype="mysettings.settings"]' },
		{ ref: 'dashboardTab', selector: '[xtype="mysettings.dashboard"]' },
		{ ref: 'displayTab', selector: '[xtype="mysettings.display"]' },
		{ ref: 'emailNotificationTab', selector: '[xtype="mysettings.emailnotification"]' },
		{ ref: 'mobileSettingsTab', selector: '[xtype="mysettings.mobilesettings"]' },
		{ ref: 'userDelegationTab', selector: '[xtype="user.userdelegation"]' },
		{ ref: 'portalCanvas', selector: '[xtype="shared.portalcanvas"]' }
	],

	init: function() {
		Ext.log('MySettings controller initialized');

		var me = this;

		// For localization
		NP.Translator.on('localeloaded', function() {
			me.changesSavedText                 = NP.Translator.translate('Changes saved successfully');
			me.errorDialogTitleText             = NP.Translator.translate('Error');
			me.registerNewDeviceDialogTitleText = NP.Translator.translate('Register New Device?');
			me.registerNewDeviceDialogText      = NP.Translator.translate('Registering a new device will disable the active one. Do you still want to proceed anyway?');
			me.disableMobileDialogTitleText     = NP.Translator.translate('Disable Mobile Number?');
			me.disableMobileDialogText          = NP.Translator.translate('Are you sure you want to disable this mobile number?');
			me.cancelDelegDialogTitleText       = NP.Translator.translate('Cancel Delegation?');
			me.cancelDelegDialogText            = NP.Translator.translate('Are you sure you want to cancel this delegation?');
			me.activeDelegErrorTitleText        = NP.Translator.translate('Active Delegation');
			me.activeDelegErrorText             = NP.Translator.translate('You have an active delegation. You cannot delegate to another user until that delegation expires or is cancelled.');
			me.blankColumnErrorText             = NP.Translator.translate('You have left one or more columns empty. Please fill those columns or remove them.');
		});

		// Setup event handlers
		me.control({
			// The main My Settings panel
			'[xtype="mysettings.main"]': {
				// Run this whenever the user clicks on a tab on the My Settings page
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('MySettings onTabChange() running');
					
					var activeTab = Ext.getClassName(newCard).split('.').pop();
					this.addHistory('MySettings:showMySettings:' + activeTab);
				}
			},
			// User Information tab
			'[xtype="mysettings.userinformation"]': {
				// This runs once the data for the User Information bound form is done loading
				dataloaded: function(formPanel, data) {
					// Select properties in item selector
					var userProps = Ext.getStore('user.Properties').getRange();
					formPanel.getForm().findField('properties').setValue(userProps);
				}
			},
			// The Save button on the User Information page
			'[xtype="mysettings.userinformation"] [xtype="shared.button.save"]': {
				// Run this whenever the save button is clicked
				click: this.saveUserInfo
			},
			// The Save button on the Settings tab
			'[xtype="mysettings.settings"] [xtype="shared.button.save"]': {
				// Run this whenever the save button is clicked
				click: this.saveSettings
			},
			// The Save button on the Display page
			'[xtype="mysettings.display"] [xtype="shared.button.save"]': {
				// Run this whenever the save button is clicked
				click: this.saveDisplay
			},
			// The Save button on the Email Notification page
			'[xtype="mysettings.emailnotification"] [xtype="shared.button.save"]': {
				// Run this whenever the save button is clicked
				click: this.saveEmailNotification
			},
			// The Save button on the Mobile Settings page
			'[xtype="mysettings.mobilesettings"] [xtype="shared.button.save"]': {
				// Run this whenever the save button is clicked
				click: function() {
					this.saveMobileSettings(false);
				}
			},
			// The Register New Device button on the Mobile Settings page
			'[xtype="mysettings.mobilesettings"] [xtype="shared.button.new"]': {
				// Run this whenever the Register New Device button is clicked
				click: function() {
					this.saveMobileSettings(true);
				}
			},
			// The Disable button on the Mobile Settings page
			'[xtype="mysettings.mobilesettings"] [xtype="shared.button.inactivate"]': {
				// Run this whenever the Disable button is clicked
				click: this.disableMobileNumber
			},
			// The Add a Delegation button in User Delegations tab
			'[xtype="mysettings.main"] [xtype="user.userdelegation"] [xtype="shared.button.new"]': {
				click: function() {
					this.application.getController('UserManager').addDelegation(NP.Security.getUser().get('userprofile_id'));
				}
			},
			// The Add a Delegation button in User Delegations tab
			'[xtype="mysettings.dashboard"] [xtype="shared.button.save"]': {
				click: this.saveDashboard
			}
		});

		// Load the Security Questions store
		me.application.loadStore('system.SecurityQuestions', 'NP.store.system.SecurityQuestions');
	},
	
	/**
	 * Shows the my settings page
	 * @param {String} [activeTab="open"] The tab currently active
	 * @param {String} [subSection]       The seubsection of the tab to open
	 * @param {String} [id]               Id for an item being viewed
	 */
	showMySettings: function(activeTab, subSection, id) {
		var that = this;

		// Set the MySettings view
		var tabPanel = that.setView('NP.view.mySettings.Main');

		// If no active tab is passed, default to Open
		if (!activeTab) activeTab = 'Overview';
		
		// Check if the tab to be selected is already active, if it isn't make it the active tab
		var tab = that['get' + activeTab + 'Tab']();
		
		// Set the active tab if it hasn't been set yet
		if (tab.getXType() != tabPanel.getActiveTab().getXType()) {
			tabPanel.suspendEvents(false);
			tabPanel.setActiveTab(tab);
			tabPanel.resumeEvents();
		}

		// Check if there's a show method for this tab
		var showMethod = 'show' + activeTab;
		if (that[showMethod]) {
			// If the show method exists, run it
			that[showMethod](subSection, id);
		}
	},

	showUserInformation: function() {
		Ext.getStore('property.AllProperties').filter('property_status', 1);
	},

	/**
	 * Saves user info from the form
	 */
	saveUserInfo: function() {
		var that = this;

		var form = this.getCmp('mysettings.userinformation');
		
		if (form.isValid()) {
			form.submitWithBindings({
				service: 'UserService',
				action : 'saveUserInfo',
				extraFields: {
					userprofile_password_current: 'userprofile_password_current',
					userprofile_password_confirm: 'userprofile_password_confirm',
					properties                  : 'properties'
				},
				success: function(result) {
					// Clear password fields after save
					if (NP.Security.getRole().get('is_admin_role') != 1) {
						form.findField('userprofile_password_current').setValue('');
					}
					form.findField('userprofile_password').setValue('');
					form.findField('userprofile_password_confirm').setValue('');

					// Show info message
					NP.Util.showFadingWindow({ html: that.changesSavedText });
				}
			});
		}
	},

	showSettings: function() {
		var form = this.getSettingsTab();

		// Bind the form to a model that's the same as the current logged in user's model
		var formModel = NP.Security.getUser().copy();
		form.setModel('user.Userprofile', formModel);

		var selectedStat = form.summaryStatStore.findRecord('id', formModel.get('userprofile_default_dashboard'));
		
		if (selectedStat !== null) {
			form.categoryCombo.setValue(selectedStat.get('category'));
		} else {
			form.onCategorySelect()
		}

		// Now update the fields to set the correct values
		form.updateBoundFields();
	},

	saveSettings: function() {
		var that = this;

		var form = this.getSettingsTab();

		if (form.isValid()) {
			var user   = NP.Security.getUser();
			var values = form.getValues();

			NP.lib.core.Net.remoteCall({
				requests: {
					service: 'UserService',
					action : 'saveDashboardSettings',
					userprofile_id                : user.get('userprofile_id'),
					userprofile_preferred_property: values['userprofile_preferred_property'],
					userprofile_preferred_region  : values['userprofile_preferred_region'],
					userprofile_default_dashboard : values['userprofile_default_dashboard'],
					success: function(result) {
						if (result.success) {
							// Show info message
							NP.Util.showFadingWindow({ html: that.changesSavedText });

							// Update the local user model
							user.set('userprofile_preferred_property', values['userprofile_preferred_property']);
							user.set('userprofile_preferred_region', values['userprofile_preferred_region']);
							user.set('userprofile_default_dashboard', values['userprofile_default_dashboard']);
						}
					}
				}
			});
		}
	},

	/**
	 * Displays the page for the Display tab
	 */
	showDisplay: function() {
		var form = this.getCmp('mysettings.display');

		// Bind the form to a model that's the same as the current logged in user's model
		var formModel = NP.Security.getUser().copy();
		form.setModel('user.Userprofile', formModel);

		// Now update the fields to set the correct values
		form.updateBoundFields();
		var screenSize = formModel.get('userprofile_splitscreen_size');
		if ( screenSize !== null && !Ext.Array.contains([25,50,60], screenSize) ) {
			form.findField('userprofile_splitscreen_size').setValue(-1);
			form.findField('userprofile_splitscreen_size_custom').setValue(screenSize);
		}
	},

	saveDisplay: function() {
		var that = this;
		var form = this.getCmp('mysettings.display');

		if (form.isValid()) {
			var values = form.getValues();
			var userprofile_splitscreen_size = (values['userprofile_splitscreen_size'] == -1) ? values['userprofile_splitscreen_size_custom'] : values['userprofile_splitscreen_size'];
			form.getModel('user.Userprofile').set('userprofile_splitscreen_size', userprofile_splitscreen_size);

			form.submitWithBindings({
				service: 'UserService',
				action : 'saveDisplaySettings',
				success: function(result) {
					// Show info message
					NP.Util.showFadingWindow({ html: that.changesSavedText });

					// Update the local user model
					var user = NP.Security.getUser();
					
					user.set('userprofile_splitscreen_size', userprofile_splitscreen_size);
					user.set('userprofile_splitscreen_isHorizontal', values['userprofile_splitscreen_isHorizontal']);
					user.set('userprofile_splitscreen_ImageOrder', values['userprofile_splitscreen_ImageOrder']);
					user.set('userprofile_splitscreen_LoadWithoutImage', values['userprofile_splitscreen_LoadWithoutImage']);
				}
			});
		}
	},

	/**
	 * Displays the page for the Email Notification tab
	 */
	showEmailNotification: function() {
		var that = this;

		// Mask the form while we load the data
		var comp = this.getCmp('mysettings.emailnotification');
		
		// Load the data we need to populate the form
		NP.lib.core.Net.remoteCall({
			mask: comp,
			requests: [
				{
					service: 'NotificationService',
					action : 'getUserNotifications',
					userprofile_id: NP.Security.getUser().get('userprofile_id'),
					success: function(result) {
						// Check the appropriate boxes
						that.application.getController('UserManager').selectEmailAlerts(result);
					},
					failure: function(response, options) {
						Ext.log('Failed to load user email notification')
					}
				},{
					service: 'NotificationService',
					action : 'getUserEmailFrequency',
					userprofile_id: NP.Security.getUser().get('userprofile_id'),
					success: function(result) {
						// Check the appropriate boxes
						that.application.getController('UserManager').selectEmailAlertHours(result);
					},
					failure: function(response, options) {
						Ext.log('Failed to load user email frequencies')
					}
				}
			]
		});
	},

	/**
	 * Saves Email Notification settings entered in the form
	 */
	saveEmailNotification: function() {
		var that = this;

		var userprofile_id = NP.Security.getUser().get('userprofile_id');

		// Submit the notification info for saving
		var maskCmp = this.getCmp('mysettings.emailnotification');
		NP.Net.remoteCall({
			method  : 'post',
			mask    : maskCmp,
			requests: {
				service        : 'NotificationService',
				action         : 'saveNotifications',
				type           : 'userprofile',
				tablekey_id    : userprofile_id,
				emailalerts    : that.application.getController('UserManager').getSelectedEmailAlerts('emailnotification'),
				emailalerthours: that.application.getController('UserManager').getSelectedEmailHours('emailnotification'),
				success: function(result) {
					if (result.success) {
						// Show info message
						NP.Util.showFadingWindow({ html: that.changesSavedText });
					} else {
						Ext.MessageBox.alert(that.errorDialogTitleText, result.error);
					}
				},
				failure: function(response, options) {
					Ext.log('Failed to save notifications');
				}
			}
		});
	},

	/**
	 * Displays the page for the Mobile Settings tab
	 */
	showMobileSettings: function() {
		var that = this;
		var form = this.getCmp('mysettings.mobilesettings');

		form.on('dataloaded', function(boundForm, data) {
			that.updateUI();
		});
	},

	/**
	 * Saves mobile settings entered in the form
	 */
	saveMobileSettings: function(isNewDevice) {
		var that = this;
		var form = this.getCmp('mysettings.mobilesettings');
		if (!isNewDevice) isNewDevice = false;

		// If the form is valid, save the mobile settings
		if (form.isValid()) {
			// Re-usable function since we need to use the call in a call back in one case
			function saveSettings() {
				var mobInfo = form.getModel('user.MobInfo');
				if (mobInfo.get('mobinfo_id') === null) {
					mobInfo.set('userprofile_id', NP.Security.getUser().get('userprofile_id'));
				}
				form.submitWithBindings({
					service: 'UserService',
					action : 'saveMobileInfo',
					extraParams: {
						isNewDevice: isNewDevice
					},
					success: function(result) {
						// Show info message
						NP.Util.showFadingWindow({ html: that.changesSavedText });

						// Update the button bar
						that.updateUI();
					}
				});
			}

			// If we're registering a new device, we want to show a confirmation box
			if (isNewDevice) {
				Ext.MessageBox.confirm(that.registerNewDeviceDialogTitleText, that.registerNewDeviceDialogText, function(btn) {
					if (btn == 'yes') {
						saveSettings();
					}
				});
			// Otherwise we just save
			} else {
				saveSettings();
			}
		}
	},

	/**
	 * Disables a mobile number
	 */
	disableMobileNumber: function() {
		var that = this;
		var form = this.getCmp('mysettings.mobilesettings');

		// Show confirm dialog
		Ext.MessageBox.confirm(that.disableMobileDialogTitleText, that.disableMobileDialogText, function(btn) {
			if (btn == 'yes') {
				// Make the request to disable the mobile number
				NP.lib.core.Net.remoteCall({
					mask    : form,
					requests: {
						service        : 'UserService',
						action         : 'disableMobileDevices',
						mobinfo_id_list: form.getModel('user.MobInfo').get('mobinfo_id'),
						success: function(result) {
							form.setModel('user.MobInfo', Ext.create('NP.model.user.MobInfo'));

							// Update the button bar
							that.updateUI();
						},
						failure: function(response, options) {
							Ext.log('Failed to disable mobile number');
						}
					}
				});
			}
		});
	},

	/**
	 * Function to update the button bar depending on if there' an active mobile number or not
	 * @private
	 */
	updateUI: function() {
		var form = this.getCmp('mysettings.mobilesettings');

		var mobInfo = form.getModel('user.MobInfo');

		if (mobInfo.get('mobinfo_id') === null) {
			form.query('[xtype="shared.button.save"]')[0].setText('Save and Activate');
			form.query('[xtype="shared.button.new"]')[0].hide();
			form.query('[xtype="shared.button.inactivate"]')[0].hide();
		} else {
			form.query('[xtype="shared.button.save"]')[0].setText('Save Changes');
			form.query('[xtype="shared.button.new"]')[0].show();
			form.query('[xtype="shared.button.inactivate"]')[0].show();
		}
		form.updateBoundFields();
		// We need to manually clear out the Confirm Pin field since it's not in the model
		form.findField('mobinfo_pin_confirm').setValue('');
	},

	/**
	 * Shows the page for the User Delegation tab
	 * @param {String} [subSection="Main"] The page currently active within the tab
	 * @param {Number} [delegation_id]     Id for the delegation being viewed if any
	 */
	showUserDelegation: function(subSection, delegation_id) {
		if (!subSection) subSection = 'Main';

		this['showUserDelegation' + subSection](delegation_id);
	},

	/**
	 * Displays the main user delegation page (the one with the two grids)
	 */
	showUserDelegationMain: function() {
		this.setView('NP.view.user.UserDelegationMain', {}, '[xtype="user.userdelegation"]');

		var grids = Ext.ComponentQuery.query('[xtype="user.userdelegationgrid"]');

		Ext.Array.each(grids, function(grid) {
			grid.addExtraParams({ userprofile_id: NP.Security.getUser().get('userprofile_id') });
			grid.getStore().load();
		});
	},

	/**
	 * Runs when clicking to the Add a Delegation button; checks first to see if user is allowed to perform
	 * this action.
	 */
	addUserDelegation: function() {
		var that = this;
		var userprofile_id = NP.Security.getUser().get('userprofile_id');
		// Check if there's an active delegation for this user
		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'UserService',
				action : 'hasActiveDelegation',
				userprofile_id: userprofile_id,
				success: function(result) {
					// If user has an active delegation, then they can't add a delegation
					if (result) {
						Ext.MessageBox.alert(that.activeDelegErrorTitleText, that.activeDelegErrorText);
					// Otherwise, it's find and redirect them to the add delegation form	
					} else {
						that.showUserDelegationForm(userprofile_id);
					}
				},
				failure: function(response, options) {
					Ext.log('Error checking if user has active delegation');
				}
			}
		});
	},

	showDashboard: function() {
		var canvas = this.getPortalCanvas();

		// Get the configuration for the dashboard
		var canvasConfig = NP.Security.getUser().get('userprofile_dashboard_layout');

		// If no configuration has been saved yet, use a blank canvas
		if (canvasConfig !== null) {
			canvas.buildFromConfig(Ext.JSON.decode(canvasConfig));
		}
	},

	saveDashboard: function() {
		var that = this;

		// If valid, we can save our dashboard layout as a user setting
		if (this.getPortalCanvas().isValid()) {
			var user   = NP.Security.getUser();
			var userprofile_dashboard_layout = this.getPortalCanvas().serialize();

			NP.lib.core.Net.remoteCall({
				requests: {
					service: 'UserService',
					action : 'saveDashboardLayout',
					userprofile_id              : user.get('userprofile_id'),
					userprofile_dashboard_layout: userprofile_dashboard_layout,
					success: function(result) {
						if (result.success) {
							// Show info message
							NP.Util.showFadingWindow({ html: that.changesSavedText });

							// Update the local user model
							user.set('userprofile_dashboard_layout', userprofile_dashboard_layout);
						}
					}
				}
			});
		} else {
			Ext.MessageBox.alert(that.errorDialogTitleText, that.blankColumnErrorText);
		}
	}
});