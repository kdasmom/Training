/**
 * The MySettings controller deals with operations in the My Settings section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.MySettings', {
	extend: 'NP.lib.core.AbstractController',
	
	requires: ['NP.lib.core.Security','NP.lib.core.Net','NP.lib.core.Util'],
	
	changesSavedText                : 'Changes saved successfully',
	errorDialogTitleText            : 'Error',
	registerNewDeviceDialogTitleText: 'Register New Device?',
	registerNewDeviceDialogText     : 'Registering a new device will disable the active one. Do you still want to proceed anyway?',
	disableMobileDialogTitleText    : 'Disable Mobile Number?',
	disableMobileDialogText         : 'Are you sure you want to disable this mobile number?',
	cancelDelegDialogTitleText      : 'Cancel Delegation?',
	cancelDelegDialogText           : 'Are you sure you want to cancel this delegation?',
	activeDelegErrorTitleText       : 'Active Delegation',
	activeDelegErrorText            : 'You have an active delegation. You cannot delegate to another user until that delegation expires or is cancelled.',

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
					this.addHistory('MySettings:showMySettings:' + activeTab);
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
			// The delegation grids
			'[xtype="mysettings.userdelegationgrid"]': {
				// Clicking on Cancel or View on one of the delegation grids
				cellclick: function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					// Only take action if the click happened on an image (button)
					if (e.target.tagName == 'IMG') {
						// Get the delegation ID for the record
						var delegation_id = record.get('Delegation_Id');
						var el = Ext.get(e.target);
						// If Cancel button was clicked
						if (el.hasCls('cancel')) {
							this.cancelDelegation(delegation_id, grid);
						// If View button was clicked
						} else if (el.hasCls('view')) {
							this.addHistory('MySettings:showMySettings:UserDelegation:Form:' + delegation_id);
						}
					}
				}
			},
			// The Add a Delegation button on User Delegations
			'[xtype="mysettings.userdelegation"] [xtype="shared.button.new"]': {
				// Run this whenever the button is clicked
				click: this.addUserDelegation
			},
			// The Cancel button on the Add Delegation form
			'[xtype="mysettings.userdelegationform"] [xtype="shared.button.cancel"]': {
				// Run this whenever the button is clicked
				click: function() { this.addHistory('MySettings:showMySettings:UserDelegation:Main'); }
			},
			// The Save button on the Add Delegation form
			'[xtype="mysettings.userdelegationform"] [xtype="shared.button.save"]': {
				// Run this whenever the button is clicked
				click: this.saveUserDelegationForm
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
	 * @param {String} [subSection]       The seubsection of the tab to open
	 * @param {String} [id]               Id for an item being viewed
	 */
	showMySettings: function(activeTab, subSection, id) {
		var that = this;

		// Load the Email Alert Types store
		this.application.loadStore('notification.EmailAlertTypes', 'NP.store.notification.EmailAlertTypes', {}, function() {
			// Set the MySettings view
			var tabPanel = that.setView('NP.view.mySettings.Main');

			// If no active tab is passed, default to Open
			if (!activeTab) activeTab = 'Overview';
			
			// Check if the tab to be selected is already active, if it isn't make it the active tab
			var tab = that.getCmp('mysettings.' + activeTab.toLowerCase());
			
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
		});
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
					NP.Util.showFadingWindow({ html: that.changesSavedText });
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
				success: function(result, deferred) {
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

	/**
	 * Saves Email Notification settings entered in the form
	 */
	saveEmailNotification: function() {
		var that = this;

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
		var maskCmp = this.getCmp('mysettings.emailnotification');
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
						NP.Util.showFadingWindow({ html: that.changesSavedText });
					} else {
						Ext.MessageBox.alert(that.errorDialogTitleText, result.error);
					}
				},
				failure: function(response, options, deferred) {
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
					success: function(result, deferred) {
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
		this.setView('NP.view.mySettings.UserDelegationMain', {}, '[xtype="mysettings.userdelegation"]');

		var grids = Ext.ComponentQuery.query('[xtype="mysettings.userdelegationgrid"]');

		Ext.Array.each(grids, function(grid) {
			grid.addExtraParams({ userprofile_id: NP.Security.getUser().get('userprofile_id') });
			grid.getStore().load();
		});
	},

	/**
	 * Cancels a delegation
	 * @param {Number}         delegation_id Id for the delegation to Cancel
	 * @param {Ext.grid.Panel} grid          The grid on which the delegation to cancel is
	 */
	cancelDelegation: function(delegation_id, grid) {
		Ext.MessageBox.confirm(this.cancelDelegDialogTitleText, this.cancelDelegDialogText, function(btn) {
			if (btn == 'yes') {
				NP.lib.core.Net.remoteCall({
					requests: {
						service      : 'UserService',
						action       : 'cancelDelegation',
						delegation_id: delegation_id,
						success      : function(result, deferred) {
							var rec = grid.getStore().query('Delegation_Id', delegation_id).getAt(0);
							rec.set('Delegation_Status', 0);
							rec.set('delegation_status_name', 'Inactive');
						},
						failure      : function(response, options, deferred) {
							Ext.log('Failed to cancel delegation')
						}
					}
				});
			}
		});
	},

	/**
	 * Runs when clicking to the Add a Delegation button; checks first to see if user is allowed to perform
	 * this action.
	 */
	addUserDelegation: function() {
		var that = this;
		// Check if there's an active delegation for this user
		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'UserService',
				action : 'hasActiveDelegation',
				userprofile_id: NP.Security.getUser().get('userprofile_id'),
				success: function(result, deferred) {
					// If user has an active delegation, then they can't add a delegation
					if (result) {
						Ext.MessageBox.alert(that.activeDelegErrorTitleText, that.activeDelegErrorText);
					// Otherwise, it's find and redirect them to the add delegation form	
					} else {
						that.addHistory('MySettings:showMySettings:UserDelegation:Form');
					}
				},
				failure: function(response, options, deferred) {
					Ext.log('Error checking if user has active delegation');
				}
			}
		});
	},

	showUserDelegationForm: function(delegation_id) {
		var viewCfg = {
			title: 'Add a Delegation',
			bind: {
				models   : ['user.Delegation']
			}
	    };

	    if (delegation_id) {
	    	Ext.apply(viewCfg.bind, {
				service    : 'UserService',
				action     : 'getDelegation',
				extraParams: {
					delegation_id: delegation_id
		        },
		        extraFields: ['delegation_properties']
	    	});
	    	viewCfg.title = 'Update a Delegation';
	    	viewCfg.listeners = {
	    		dataloaded: function(boundForm, data) {
					boundForm.findField('Delegation_To_UserProfile_Id').setRawValue(data['Delegation_To_UserProfile_Id']);
				}
			};
	    }

		var form = this.setView('NP.view.mySettings.UserDelegationForm', viewCfg, '[xtype="mysettings.userdelegation"]');
		var userField = form.findField('Delegation_To_UserProfile_Id');
		if (delegation_id) {
			userField.hide();
			form.findField('Delegation_StartDate').disable();
		} else {
			userField.getStore().load();
		}
	},

	saveUserDelegationForm: function() {
		var that = this;
		var form = this.getCmp('mysettings.userdelegationform');
		form.getModel('user.Delegation').set('UserProfile_Id', NP.Security.getUser().get('userprofile_id'));

		if (form.isValid()) {
			form.submitWithBindings({
				service: 'UserService',
				action : 'saveDelegation',
				extraFields: {
					delegation_properties: 'delegation_properties'
				},
				success: function(result, deferred) {
					// Relocate to the main page
					that.addHistory('MySettings:showMySettings:UserDelegation:Main');
				}
			});
		}
	}
});