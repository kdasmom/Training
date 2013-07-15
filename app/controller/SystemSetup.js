/**
 * The SystemSetup controller deals with operations in the System Setup section of the app
 *
 * @author Witold Frackiewicz - Testerix
 */
Ext.define('NP.controller.SystemSetup', {
	extend: 'NP.lib.core.AbstractController',
	
	requires: [
	    'NP.lib.core.Security',
	    'NP.lib.core.Net',
	    'NP.lib.core.Util',
	    'NP.lib.core.Config',
	],
	
	changesSavedText                : 'Changes saved successfully',
	errorDialogTitleText            : 'Error',

	refs : [{
		ref: 'PasswordConfiguration',
		selector: '[xtype="systemsetup.passwordconfiguration"]'
	}],
	
	init: function() {
		Ext.log('SystemSetup controller initialized');

		var app = this.application;

		// Setup event handlers
		this.control({
			// The main System Setup panel
			'[xtype="systemsetup.main"]': {
				// Run this whenever the user clicks on a tab on the System Setup page
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('SystemSetup onTabChange() running');
					
					var activeTab = Ext.getClassName(newCard).split('.').pop();
					this.addHistory('SystemSetup:showSystemSetup:' + activeTab);
				}
			},
			
			// The Save button on the Password Configuration page
			'[xtype="systemsetup.passwordconfiguration"] [xtype="shared.button.save"]': {
				// Run this whenever the save button is clicked
				click: this.savePasswordConfiguration
			}
		});

	},
	
	/**
	 * Shows the system setup page
	 * @param {String} [activeTab="open"] The tab currently active
	 * @param {String} [subSection]       The seubsection of the tab to open
	 * @param {String} [id]               Id for an item being viewed
	 */
	showSystemSetup: function(activeTab, subSection, id) {
		var that = this;

		// Set the SystemSetup view
		var tabPanel = that.setView('NP.view.systemSetup.Main');

		// If no active tab is passed, default to Open
		if (!activeTab) activeTab = 'Overview';
		
		// Check if the tab to be selected is already active, if it isn't make it the active tab
		var tab = that.getCmp('systemsetup.' + activeTab.toLowerCase());
		
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

	/**
	 * Displays the page for the Password Configuration tab
	 */
	showPasswordConfiguration: function() {
		var form = this.getPasswordConfiguration();

		NP.lib.core.Net.remoteCall({
			requests: {
				service    : 'ConfigService',
				action     : 'getPasswordConfiguration',
				success    : function(result, deferred) {
					//Formating results to integer so value types will match expecting values for form, needed for combobox
					for( i in result){
						result[i] = parseInt(result[i]);
					}
					// Set values in Form using results
					form.getForm().setValues(result);
				}
			}
		});
		
	},

	
	/**
	 * Save Password Configuration
	 */
	savePasswordConfiguration: function() {
		var that = this;
		var form = this.getPasswordConfiguration();

		if (form.getForm().isValid()) {
			var values = form.getValues();
			
			NP.lib.core.Net.remoteCall({
				requests: {
					service    : 'ConfigService',
					action     : 'setPasswordConfiguration',
					data	   : values,
					success    : function(result, deferred) {
						// If save is successful, run success callback
						if (result.success) {
							//Setting new password configuration settings
							for(i in values){
								NP.Config.setSetting(i, values[i]);
							}
						}else{
							// Only try to process results if there's an errors array
							if (result.errors && result.errors instanceof Array) {
								Ext.each(result.errors, function(error) {
									if (error.field == 'global') {
										Ext.MessageBox.alert('Error', error.msg);
										return false;
									} else {
										var field = form.getForm().findField(error.field);
										if (field) {
											field.markInvalid(error.msg);
										}
									}
								});
								var invalidFields = form.getForm().findInvalid();
								if (invalidFields.getCount()) {
									invalidFields.getAt(0).ensureVisible();
								}
							}
						}
					}
				}
			});
		}
	}
});