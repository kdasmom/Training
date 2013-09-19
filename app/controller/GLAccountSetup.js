/**
 * The GLAccountSetup controller deals with operations in the Administration > GL Account Setup Setup section of the app
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.controller.GLAccountSetup', {
	extend: 'NP.lib.core.AbstractController',
	
	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security',
		'NP.lib.core.Net',
		'NP.lib.core.Util'
	],
	
	// For localization
	errorDialogTitleText      : 'Error',
        newGLAccountTitleText     : 'New GL Account',
	editPropertyTitleText     : 'Editing',

	init: function() {
		Ext.log('GLAccountSetup controller initialized');

		var app = this.application;

		// Setup event handlers
		this.control({
			// The main GL Account Setup panel
			'[xtype="glaccount.main"]': {
				// Run this whenever the user clicks on a tab on the GL Account Setup page
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('GLAccountSetup onTabChange() running');
					
					var activeTab = Ext.getClassName(newCard).split('.').pop();
					this.addHistory('GLAccountSetup:showGLAccountSetup:' + activeTab);
				}
			}
			
		});
	},
	
	/**
	 * Shows the main GL Account Setup page
	 * @param {String} [activeTab="Overview"] The tab currently active
	 * @param {String} [subSection]           The seubsection of the tab to open
	 * @param {String} [id]                   Id for an item being viewed
	 */
	showGLAccountSetup: function(activeTab, subSection, id) {
		var that = this;

		// Set the GL Account view
		var tabPanel = that.setView('NP.view.glaccount.Main');

		// If no active tab is passed, default to Open
		if (!activeTab) activeTab = 'Overview';
		
		// Check if the tab to be selected is already active, if it isn't make it the active tab
		var tab = that.getCmp('glaccount.' + activeTab.toLowerCase());
		
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
	}
});