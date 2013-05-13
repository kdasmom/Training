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
			// The main My Settings panel
			'[xtype="mysettings.main"]': {
				// Run this whenever the user clicks on a tab on the My Settings page
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('MySettings onTabChange() running');
					
					var activeTab = Ext.getClassName(newCard).split('.').pop();
					this.application.addHistory('MySettings:showMySettings:' + activeTab);
				}
			},
			// User Information tab
			'[xtype="mysettings.userinformation"]': {
				// This runs once the data for the User Information bound form is done loading
				dataloaded: function(formPanel, data) {
					// Select properties in item selector
					var userProps = Ext.getStore('user.Properties').getRange();
					formPanel.getForm().findField('user_properties').setValue(userProps);
				}
			},
			// The Save button on the User Information page
			'[xtype="mysettings.userinformation"] [xtype="shared.button.save"]': {
				// Run this whenever the save button is clicked
				click: this.saveUserInfo
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
		var that = this;

		// Load the Email Alert Types store
		this.application.loadStore('notification.EmailAlertTypes', 'NP.store.notification.EmailAlertTypes', {}, function() {
			// Set the MySettings view
			var tabPanel = that.application.setView('NP.view.mySettings.Main');

			// If no active tab is passed, default to Open
			if (!activeTab) activeTab = 'Overview';
			
			// Check if the tab to be selected is already active, if it isn't make it the active tab
			var tab = that.application.getComponent('mysettings.' + activeTab.toLowerCase());
			
			// Set the active tab if it hasn't been set yet
			if (tab.getXType() != tabPanel.getActiveTab().getXType()) {
				tabPanel.setActiveTab(tab);
			}

			// Check if there's a show method for this tab
			var showMethod = 'show' + activeTab;
			if (that[showMethod]) {
				// If the show method exists, run it
				that[showMethod](tab);
			}
		});
	},

	saveUserInfo: function() {
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
	},

	showEmailNotification: function() {
		// Mask the form while we load the data
		var comp = this.application.getComponent('mysettings.emailnotification');
		
		// Load the data we need to populate the form
		NP.lib.core.Net.remoteCall({
			mask: comp,
			requests: [
				{
					service: 'NotificationService',
					action : 'getUserNotifications',
					userprofile_id: NP.Security.getUser().get('userprofile_id'),
					success: function(result, deferred) {
						// Check the appropriate boxes
						Ext.Array.each(result, function(alertType) {
							var checkbox = Ext.ComponentQuery.query('#emailalerttype_id_alt_' + alertType['emailalert_type']);
							if (checkbox.length) {
								checkbox[0].setValue(true);
							}
							var combo = Ext.ComponentQuery.query('#emailalert_days_pending_' + alertType['emailalert_type']);
							if (combo.length) {
								combo[0].setValue(parseInt(alertType['emailalert_days_pending']));
							}
						});
					},
					failure: function(response, options, deferred) {
						Ext.log('Failed to load user email notification')
					}
				},{
					service: 'NotificationService',
					action : 'getUserEmailFrequency',
					userprofile_id: NP.Security.getUser().get('userprofile_id'),
					success: function(result, deferred) {
						// Check the appropriate boxes
						Ext.Array.each(result, function(hour) {
							Ext.ComponentQuery.query('#emailalert_hours_' + hour)[0].setValue(true);
						});
					},
					failure: function(response, options, deferred) {
						Ext.log('Failed to load user email frequencies')
					}
				}
			]
		});
	},

	saveEmailNotification: function() {
		var userprofile_id = NP.Security.getUser().get('userprofile_id');

		// Get the value for the alert checkboxes
		var emailalerttype_id_alt_list = NP.Util.getCheckboxValue('emailalerttype_id_alt');
		
		// Build the email alert records
		var emailalerts = [];
		Ext.Array.each(emailalerttype_id_alt_list, function(emailalerttype_id_alt) {
			var combo = Ext.ComponentQuery.query('#emailalert_days_pending_' + emailalerttype_id_alt);
			var emailalert_days_pending = (combo.length) ? combo[0].getValue() : null;
			emailalerts.push({
				emailalert_type        : emailalerttype_id_alt,
				userprofile_id         : userprofile_id,
				emailalert_days_pending: emailalert_days_pending
			});
		});

		// Get the value for the frequency checkboxes
		var emailalerthour_list = NP.Util.getCheckboxValue('emailalert_hours');

		// Build the email alert hour records
		var emailalerthours = [];
		Ext.Array.each(emailalerthour_list, function(emailalerthour) {
			emailalerthours.push({
				runhour       : emailalerthour,
				userprofile_id: userprofile_id
			});
		});

		// Submit the notification info for saving
		var maskCmp = this.application.getComponent('mysettings.emailnotification');
		NP.Net.remoteCall({
			method  : 'post',
			mask    : maskCmp,
			requests: {
				service        : 'NotificationService',
				action         : 'saveNotifications',
				userprofile_id : userprofile_id,
				emailalerts    : emailalerts,
				emailalerthours: emailalerthours,
				success: function(result, deferred) {
					if (result.success) {
						// Show info message
						NP.Util.showFadingWindow({ html: 'Changes saved successfully' });
					} else {
						Ext.MessageBox.alert('Error', result.error);
					}
				},
				failure: function(response, options, deferred) {
					Ext.log('Failed to save notifications');
				}
			}
		});
	},

	showMobileSettings: function() {
		var that = this;
		var form = this.application.getComponent('mysettings.mobilesettings');

		form.on('dataloaded', function(boundForm, data) {
			that.updateUI();
		});
	},

	saveMobileSettings: function(isNewDevice) {
		var that = this;
		var form = this.application.getComponent('mysettings.mobilesettings');
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
					success: function(result, deferred) {
						// Show info message
						NP.Util.showFadingWindow({ html: 'Changes saved successfully' });

						// Update the button bar
						that.updateUI();
					}
				});
			}

			// If we're registering a new device, we want to show a confirmation box
			if (isNewDevice) {
				Ext.MessageBox.confirm('Register New Device?', 'Registering a new device will disable the active one. Do you still want to proceed anyway?', function(btn) {
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

	disableMobileNumber: function() {
		var that = this;
		var form = this.application.getComponent('mysettings.mobilesettings');

		// Show confirm dialog
		Ext.MessageBox.confirm('Disable Mobile Number?', 'Are you sure you want to disable this mobile number?', function(btn) {
			if (btn == 'yes') {
				// Make the request to disable the mobile number
				NP.lib.core.Net.remoteCall({
					mask    : form,
					requests: {
						service        : 'UserService',
						action         : 'disableMobileDevices',
						mobinfo_id_list: form.getModel('user.MobInfo').get('mobinfo_id'),
						success: function(result, deferred) {
							form.setModel('user.MobInfo', Ext.create('NP.model.user.MobInfo'));

							// Update the button bar
							that.updateUI();
						},
						failure: function(response, options, deferred) {
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
		var form = this.application.getComponent('mysettings.mobilesettings');

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
	}
});