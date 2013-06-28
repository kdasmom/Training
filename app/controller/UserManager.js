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
		'NP.lib.core.Util'
	],
	
	// For localization
	activateSuccessText  : 'Users were activated',
	activateFailureText  : 'There was an error activating users',
	inactivateSuccessText: 'Users were inactivated',
	inactivateFailureText: 'There was an error inactivating users',

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
			// The Users grid
			'[xtype="user.users"] customgrid': {
				// Making a selection on the grid
				selectionchange: this.selectUser,
				itemclick:       this.viewUser
			},
			// The Activate button on the grid
			'[xtype="user.users"] [xtype="shared.button.activate"]': {
				click: function() {
					this.toggleGridUsersActivation('activate');
				}
			},
			// The Inactivate button on the grid
			'[xtype="user.users"] [xtype="shared.button.inactivate"]': {
				click: function() {
					this.toggleGridUsersActivation('inactivate');
				}
			}
		});
	},
	
	selectUser: function(selectionModel, selected) {
		var grid = this.getCmp('user.users').query('customgrid')[0];
		
		// Change the buttons that show in the toolbar
		var activateBtn = grid.query('[xtype="shared.button.activate"]')[0];
		var inactivateBtn = grid.query('[xtype="shared.button.inactivate"]')[0];

		var fn = (selected.length) ? 'enable' : 'disable';
		activateBtn[fn]();
		inactivateBtn[fn]();
	},

	toggleGridUsersActivation: function(action) {
		var grid = this.getCmp('user.users').query('customgrid')[0];
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

		var grid = this.getCmp('user.users').query('customgrid')[0];

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
		if (!subSection) subSection = 'Main';

		this['showUsers' + subSection](userprofile_id);
	},

	showUsersMain: function() {
		var grid = this.getCmp('user.users').query('customgrid')[0];
		grid.getStore().load();
	},

	viewUser: function(grid, rec, item, index, e) {
		if (e.getTarget().className != 'x-grid-row-checker') {
			
		}
	}
});