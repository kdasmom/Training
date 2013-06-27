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
		
	}
});