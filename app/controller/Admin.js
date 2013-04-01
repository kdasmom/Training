/**
 * The Admin controller deals with operations in the Administration section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.Admin', {
	extend: 'Ext.app.Controller',
	
	requires: ['NP.lib.core.Security'],
	
	stores: ['system.SecurityQuestions'],

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
			'[xtype="admin.mysettings.userinformation"] [xtype="shared.button.save"]': {
				click: function() {
					alert('Saving!');
				}
			}
		});

		Ext.StoreManager.lookup('system.SecurityQuestions').load();
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
		var tab = Ext.ComponentQuery.query('[xtype="admin.mysettings.' + activeTab.toLowerCase() + '"]')[0];
		var tabPanel = Ext.ComponentQuery.query('[xtype="admin.mysettings"]')[0];
		
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

	/**
	 * Populates the user information panel with data
	 */
	showUserInformation: function(tab) {
		var user = NP.lib.core.Security.getUser();
		var form = tab.getForm();
		
		form.setValues(user);
	}
});