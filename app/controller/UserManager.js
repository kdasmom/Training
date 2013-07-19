/**
 * The UserManager controller deals with operations in the Administration > User Manager section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.UserManager', {
	extend: 'NP.lib.core.AbstractController',
	
	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security',
		'NP.lib.core.Net',
		'NP.lib.core.Util',
		'Ext.ux.form.field.BoxSelect'
	],
	
	refs: [
		{ ref: 'userGrid', selector: '[xtype="user.usersgrid"] customgrid' },
		{ ref: 'userActivateBtn', selector: '[xtype="user.usersgrid"] [xtype="shared.button.activate"]' },
		{ ref: 'userInactivateBtn', selector: '[xtype="user.usersgrid"] [xtype="shared.button.inactivate"]' },
		{ ref: 'userForm', selector: '[xtype="user.usersform"]' },
		{ ref: 'delegationTab', selector: '[xtype="user.userdelegation"]' },
		{ ref: 'delegationWindow', selector: '#delegationFormWin' },
		{ ref: 'delegationForm', selector: '[xtype="user.userdelegationform"]' },
		{ ref: 'groupGrid', selector: '[xtype="user.groupsgrid"] customgrid' },
		{ ref: 'groupForm', selector: '[xtype="user.groupsform"]' },
		{ ref: 'groupTree', selector: '[xtype="user.groupsformpermissions"]' }
	],

	// For localization
	activateSuccessText       : 'Users were activated',
	activateFailureText       : 'There was an error activating users',
	inactivateSuccessText     : 'Users were inactivated',
	inactivateFailureText     : 'There was an error inactivating users',
	activeDelegErrorTitleText : 'Active Delegation',
	activeDelegErrorText      : 'You have an active delegation. You cannot delegate to another user until that delegation expires or is cancelled.',
	cancelDelegDialogTitleText: 'Cancel Delegation?',
	cancelDelegDialogText     : 'Are you sure you want to cancel this delegation?',
	addDelegationDlgTitle     : 'Add a Delegation',
	updateDelegationDlgTitle  : 'Update Delegation',
	newUserFormTitle          : 'New User',
	editUserFormTitle         : 'Editing User',
	newGroupFormTitle         : 'New Group',
	editGroupFormTitle        : 'Editing Group',
	changesSavedText          : 'Changes saved successfully',
	errorDialogTitleText      : 'Error',

	init: function() {
		Ext.log('UserManager controller initialized');

		var app = this.application;

		// Setup event handlers
		this.control({
			// The main Property Setup panel
			'[xtype="user.usermanager"]': {
				// Run this whenever the user clicks on a tab on the Property Setup page
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('UserManager onTabChange() running');
					
					var activeTab = Ext.getClassName(newCard).split('.').pop();
					this.addHistory('UserManager:showUserManager:' + activeTab);
				}
			},
			// The create new user button on the Overview tab
			'#newUserBtn': {
				click: this.createNewUser
			},
			// The create new user button on the Overview tab
			'#newGroupBtn': {
				click: this.createNewGroup
			},
			// The Users grid
			'[xtype="user.usersgrid"] customgrid': {
				// Making a selection on the grid
				selectionchange: this.selectUser,
				itemclick      : function(grid, rec, item, index, e) {
					if (e.getTarget().className != 'x-grid-row-checker') {
						this.addHistory('UserManager:showUserManager:Users:Form:' + rec.get('userprofile_id'));
					}
				}
			},
			// The Create New User button on the grid
			'[xtype="user.usersgrid"] [xtype="shared.button.new"]': {
				click: this.createNewUser
			},
			// The Activate button on the grid
			'[xtype="user.usersgrid"] [xtype="shared.button.activate"]': {
				click: function() {
					this.toggleGridUsersActivation('activate');
				}
			},
			// The Inactivate button on the grid
			'[xtype="user.usersgrid"] [xtype="shared.button.inactivate"]': {
				click: function() {
					this.toggleGridUsersActivation('inactivate');
				}
			},
			// The Save button on the user form
			'[xtype="user.usersform"] [xtype="shared.button.save"]': {
				click: this.saveUser
			},
			// The Cancel button on the user form
			'[xtype="user.usersform"] > toolbar > [xtype="shared.button.cancel"]': {
				click: function() {
					this.addHistory('UserManager:showUserManager:Users');
				}
			},
			// The Add a Delegation button in Delegations tab
			'[xtype="user.usersform"] [xtype="user.userdelegation"] [xtype="shared.button.new"]': {
				click: function() {
					this.addDelegation(this.activeUser.get('userprofile_id'));
				}
			},
			// The Save button on the Delegation Form
			'[xtype="user.userdelegationform"] [xtype="shared.button.save"]': {
				click: function() {
					this.saveUserDelegationForm();
				}
			},
			// The Cancel button on the Delegation Form
			'[xtype="user.userdelegationform"] [xtype="shared.button.cancel"]': {
				click: function() {
					this.getDelegationWindow().close();
				}
			},
			// The delegation grids
			'[xtype="user.userdelegationgrid"]': {
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
							this.showUserDelegationForm(record.get('UserProfile_Id'), delegation_id);
						}
					}
				}
			},
			// The Groups grid
			'[xtype="user.groupsgrid"] customgrid': {
				itemclick      : function(grid, rec, item, index, e) {
					this.addHistory('UserManager:showUserManager:Groups:Form:' + rec.get('role_id'));
				}
			},
			// The Create New User button on the grid
			'[xtype="user.groupsgrid"] [xtype="shared.button.new"]': {
				click: this.createNewGroup
			},
			// The Save button on the group form
			'[xtype="user.groupsform"] [xtype="shared.button.save"]': {
				click: this.saveGroup
			},
			// The Cancel button on the user form
			'[xtype="user.groupsform"] [xtype="shared.button.cancel"]': {
				click: function() {
					this.addHistory('UserManager:showUserManager:Groups');
				}
			},
			// The Save button on the group form
			'[xtype="user.groupsform"] [xtype="shared.button.new"]': {
				click: this.createCopy
			}
		});
	},
	
	createNewUser: function() {
		this.addHistory('UserManager:showUserManager:Users:Form');
	},
	
	createNewGroup: function() {
		this.addHistory('UserManager:showUserManager:Groups:Form');
	},

	selectUser: function(selectionModel, selected) {
		var fn = (selected.length) ? 'enable' : 'disable';
		this.getUserActivateBtn()[fn]();
		this.getUserInactivateBtn()[fn]();
	},

	toggleGridUsersActivation: function(action) {
		var grid = this.getUserGrid();
		var users = grid.getSelectionModel().getSelection();
		var userprofile_id_list = [];
		var userprofile_status = (action == 'activate') ? 'active' : 'inactive';
		var now = new Date();
		Ext.each(users, function(user) {
			user.set('userprofile_status', userprofile_status);
			user.set('updated_by_userprofile_id', NP.Security.getUser().get('userprofile_id'));
			user.set('userprofile_updated_datetm', now);
			userprofile_id_list.push(user.get('userprofile_id'));
		});

		this.toggleUserActivation(userprofile_id_list, action);
	},

	toggleUserActivation: function(userprofile_id_list, action) {
		var that = this;

		var grid = this.getUserGrid();

		NP.lib.core.Net.remoteCall({
			method  : 'POST',
			mask    : grid,
			requests: {
				service               : 'UserService',
				action                : action+'Users',
				userprofile_updated_by: NP.Security.getUser().get('userprofile_id'),
				userprofile_id_list   : userprofile_id_list,
				success: function(result, deferred) {
					// Unmark items in the grid
					grid.getStore().commitChanges();
					// Show a friendly message saying action was successful
					NP.Util.showFadingWindow({ html: that[action + 'SuccessText'] });
				},
				failure: function(response, options, deferred) {
					grid.getStore().rejectChanges();
					Ext.MessageBox.alert(that.errorDialogTitleText, that[action + 'FailureText']);
				}
			}
		});
	},

	/**
	 * Shows the main User Manager tab panel
	 * @param {String} [activeTab="Overview"] The tab currently active
	 * @param {String} [subSection]           The subsection of the tab to open
	 * @param {String} [id]                   Id for an item being viewed
	 */
	showUserManager: function(activeTab, subSection, id) {
		var that = this;

		// Set the User Manager view
		var tabPanel = that.setView('NP.view.user.UserManager');

		// If no active tab is passed, default to Open
		if (!activeTab) activeTab = 'Overview';
		
		// Check if the tab to be selected is already active, if it isn't make it the active tab
		var tab = that.getCmp('user.' + activeTab.toLowerCase());
		
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

	showUsers: function(subSection, userprofile_id) {
		if (!subSection) subSection = 'Grid';

		this['showUsers' + subSection](userprofile_id);
	},

	showUsersGrid: function() {
		this.setView('NP.view.user.UsersGrid', {}, '[xtype="user.users"]');

		this.getUserGrid().getStore().load();
	},

	showUsersForm: function(userprofile_id) {
		var that = this;

		// Load a store if it hasn't already been loaded before proceeding
		this.application.loadStore('notification.EmailAlertTypes', 'NP.store.notification.EmailAlertTypes', {}, function() {
			// Setup the view configuration
			var viewCfg = {
				bind: {
			        models: [
			            'user.Userprofile',
			            'user.Userprofilerole',
			            'user.Staff',
			            'contact.Person',
			            'contact.Address',
			            'contact.Email',
			            {
			                class: 'contact.Phone',
			                prefix: 'home_'
			            },
			            {
			                class: 'contact.Phone',
			                prefix: 'work_'
			            }
			        ]
			    },
			    passwordRequired: true
			};

			// Only do this if viewing an existing user
			if (userprofile_id) {
				Ext.apply(viewCfg, {
			    	passwordRequired: false,
					listeners       : {
				    	dataloaded: function(formPanel, data) {
				    		// Set the form title
				    		formPanel.setTitle(that.editUserFormTitle + ' "' + data['userprofile_username'] + '"');

				    		// Set the active user for easy access later
				    		that.activeUser = formPanel.getModel('user.Userprofile');

							// Check the appropriate email alert boxes
							that.selectEmailAlerts(data['email_alerts']);

							// Check the appropriate email alert hour boxes
							that.selectEmailAlertHours(data['email_hours']);
						}
				    }
				});

				Ext.apply(viewCfg.bind, {
					service: 'UserService',
			        action : 'get',
			        extraParams: {
			            userprofile_id: userprofile_id
			        },
			        extraFields: ['role_id','properties','coding_properties']
				});
			}

			// Create the view with the configuration defined above
			var form = that.setView('NP.view.user.UsersForm', viewCfg, '[xtype="user.users"]');

			// Only do this if we're editing a user
			if (userprofile_id) {
				Ext.suspendLayouts();
				
				form.findField('userprofile_username').disable();
				form.findField('userprofile_password_current').show();
				var delegTab = that.getDelegationTab();
				delegTab.show();
				delegTab.tab.show();

				Ext.resumeLayouts(true);
				
				// Load the delegation grids
			    var grids = Ext.ComponentQuery.query('[xtype="user.userdelegationgrid"]');
				Ext.Array.each(grids, function(grid) {
					grid.addExtraParams({ userprofile_id: userprofile_id });
					grid.getStore().load();
				});
			}
			// Only do this if we're creating a new user
			else {
				// Set the form title
				form.setTitle(that.newUserFormTitle);

				form.findField('userprofile_username').enable();
				form.findField('userprofile_password_current').hide();
			}
		});
	},

	selectEmailAlerts: function(emailAlertTypes) {
		Ext.Array.each(emailAlertTypes, function(alertType) {
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

	selectEmailAlertHours: function(emailAlertHours) {
		Ext.Array.each(emailAlertHours, function(hour) {
			Ext.ComponentQuery.query('#emailalert_hours_' + hour)[0].setValue(true);
		});
	},

	addDelegation: function(userprofile_id, delegation_id) {
		var that = this;
		// Check if there's an active delegation for this user
		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'UserService',
				action : 'hasActiveDelegation',
				userprofile_id: userprofile_id,
				success: function(result, deferred) {
					// If user has an active delegation, then they can't add a delegation
					if (result) {
						Ext.MessageBox.alert(that.activeDelegErrorTitleText, that.activeDelegErrorText);
					// Otherwise, it's fine and show the delegation form
					} else {
						that.showUserDelegationForm(userprofile_id, delegation_id);
					}
				},
				failure: function(response, options, deferred) {
					Ext.log('Error checking if user has active delegation');
				}
			}
		});
	},

	showUserDelegationForm: function(userprofile_id, delegation_id) {
		var viewCfg = {
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
	    	viewCfg.listeners = {
	    		dataloaded: function(boundForm, data) {
					boundForm.findField('Delegation_To_UserProfile_Id').setRawValue(data['Delegation_To_UserProfile_Id']);
				}
			};
	    }

	    var form = Ext.create('NP.view.user.UserDelegationForm', viewCfg);

	    Ext.create('Ext.window.Window', {
			itemId: 'delegationFormWin',
			title : (delegation_id) ? this.updateDelegationDlgTitle : this.addDelegationDlgTitle,
			width : 800,
			modal : true,
			layout: 'fit',
			items : [form]
		}).show();

	    // Set the userprofile_id hidden field
	    form.findField('UserProfile_Id').setValue(userprofile_id);

	    // Load the properties in box select
		var propertyField = form.findField('delegation_properties');
		propertyField.getStore().addExtraParams({
			userprofile_id             : userprofile_id,
			delegated_to_userprofile_id: userprofile_id
		});

		var mask = new Ext.LoadMask(form);
		propertyField.getStore().load(function() {
			mask.destroy();
		});

		var userField = form.findField('Delegation_To_UserProfile_Id');
		if (delegation_id) {
			userField.hide();
			form.findField('Delegation_StartDate').disable();
		} else {
			userField.getStore().addExtraParams({ userprofile_id: userprofile_id });
			userField.getStore().load();
		}
	},

	saveUserDelegationForm: function() {
		var that = this;

		var form = that.getDelegationForm();
		
		if (form.isValid()) {
			form.submitWithBindings({
				service: 'UserService',
				action : 'saveDelegation',
				extraFields: {
					delegation_properties: 'delegation_properties'
				},
				success: function(result, deferred) {
					// Close the form window
					that.getDelegationWindow().close();

					// Reload only the first grid
					var grid = Ext.ComponentQuery.query('[xtype="user.userdelegationgrid"]')[0];
					grid.getStore().load();
				}
			});
		}
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

	saveUser: function() {
		var that = this;

		var form = this.getUserForm();
		
		if (form.isValid()) {
			form.submitWithBindings({
				service: 'UserService',
				action : 'saveUser',
				extraParams: {
					emailalerts    : this.getSelectedEmailAlerts(),
					emailalerthours: this.getSelectedEmailHours()
				},
				extraFields: {
					userprofile_password_confirm: 'userprofile_password_confirm',
					properties                  : 'properties',
					coding_properties           : 'coding_properties'
				},
				success: function(result, deferred) {
					// Show info message
					NP.Util.showFadingWindow({ html: that.changesSavedText });

					that.addHistory('UserManager:showUserManager:Users');
				}
			});
		}
	},

	getSelectedEmailAlerts: function() {
		// Get the value for the alert checkboxes
		var emailalerttype_id_alt_list = NP.Util.getCheckboxValue('emailalerttype_id_alt');
		
		// Build the email alert records
		var emailalerts = [];
		Ext.Array.each(emailalerttype_id_alt_list, function(emailalerttype_id_alt) {
			var combo = Ext.ComponentQuery.query('#emailalert_days_pending_' + emailalerttype_id_alt);
			var emailalert_days_pending = (combo.length) ? combo[0].getValue() : null;
			emailalerts.push({
				emailalert_type        : emailalerttype_id_alt,
				emailalert_days_pending: emailalert_days_pending
			});
		});

		return emailalerts;
	},

	getSelectedEmailHours: function() {
		// Get the value for the frequency checkboxes
		var emailalerthour_list = NP.Util.getCheckboxValue('emailalert_hours');

		// Build the email alert hour records
		var emailalerthours = [];
		Ext.Array.each(emailalerthour_list, function(emailalerthour) {
			emailalerthours.push({
				runhour       : emailalerthour
			});
		});

		return emailalerthours;
	},

	showGroups: function(subSection, role_id) {
		if (!subSection) subSection = 'Grid';

		this['showGroups' + subSection](role_id);
	},

	showGroupsGrid: function() {
		this.setView('NP.view.user.GroupsGrid', {}, '[xtype="user.groups"]');

		this.getGroupGrid().getStore().load();
	},

	showGroupsForm: function(role_id) {
		var that = this;

		var forceViewCreate = false;
		if (role_id && this.activeRole && role_id != this.activeRole.get('role_id')) {
			forceViewCreate = true;
		}

		// Load a store if it hasn't already been loaded before proceeding
		this.application.loadStore('notification.EmailAlertTypes', 'NP.store.notification.EmailAlertTypes', {}, function() {
			// Setup the view configuration
			var viewCfg = {
				bind: {
			        models: ['user.Role']
			    },
			    // Set the form title
				title: that.newGroupFormTitle
			};

			// Only do this if viewing an existing user
			if (role_id) {
				Ext.apply(viewCfg, {
			    	listeners       : {
				    	dataloaded: function(formPanel, data) {
				    		// Set the form title
				    		formPanel.setTitle(that.editGroupFormTitle + ' "' + data['role_name'] + '"');

				    		// Set the active user for easy access later
				    		that.activeRole = formPanel.getModel('user.Role');

							// Check the appropriate email alert boxes
							that.selectEmailAlerts(data['email_alerts']);

							// Check the appropriate email alert hour boxes
							that.selectEmailAlertHours(data['email_hours']);

							// Check nodes that are on for the role
							var tree = that.getGroupTree();
							tree.getRootNode().cascadeBy(function(n) {
								if (n.get('module_id') in data['permissions']) {
									n.set('checked', true);
								}
							});
						}
				    }
				});

				Ext.apply(viewCfg.bind, {
					service    : 'UserService',
					action     : 'getRole',
					extraFields: ['parent_role_id'],
					extraParams: {
			            role_id: role_id
			        }
				});
			}

			// Create the view with the configuration defined above
			var form = that.setView('NP.view.user.GroupsForm', viewCfg, '[xtype="user.groups"]', forceViewCreate);
		});
	},

	saveGroup: function() {
		var that = this;

		var form = this.getGroupForm();
		
		if (form.isValid()) {
			var permissions = [];
			var checkedModules = this.getGroupTree().getChecked();
			Ext.Array.each(checkedModules, function(rec) {
				var module_id = rec.get('module_id');
				if (module_id !== null) {
					permissions.push(module_id);
				}
			});

			form.submitWithBindings({
				service: 'UserService',
				action : 'saveRole',
				extraParams: {
					permissions    : permissions,
					emailalerts    : this.getSelectedEmailAlerts(),
					emailalerthours: this.getSelectedEmailHours()
				},
				extraFields: {
					parent_role_id: 'parent_role_id',
					email_overwrite: 'email_overwrite'
				},
				success: function(result, deferred) {
					// Show info message
					NP.Util.showFadingWindow({ html: that.changesSavedText });

					that.addHistory('UserManager:showUserManager:Groups');
				}
			});
		}
	},

	createCopy: function() {
		var that = this;

		NP.lib.core.Net.remoteCall({
			mask: that.getGroupForm(),
			requests: {
				service: 'UserService',
				action : 'copyRole',
				role_id: this.activeRole.get('role_id'),
				success: function(result, deferred) {
					if (result.success) {
						that.addHistory('UserManager:showUserManager:Groups:Form:' + result['role_id']);

						// Show info message
						NP.Util.showFadingWindow({ html: that.changesSavedText });
					} else {
						Ext.MessageBox.alert(that.errorDialogTitleText, result.errors[0]['msg']);
					}
				}
			}
		});
	}
});