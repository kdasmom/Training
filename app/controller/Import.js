/**
 * The Import controller deals with import/export utility in the Administration section of the app
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.controller.Import', {
	extend: 'NP.lib.core.AbstractController',
	
	requires: ['NP.lib.core.Config',
	           'NP.lib.core.Net',
	           'NP.lib.core.Util',
	           'NP.lib.core.Security'
           		],
	
	refs: [
			{ ref: 'overviewTab', selector: '[xtype="import.overview"]' },
			{ ref: 'glTab', selector: '[xtype="import.gl"]' },
			{ ref: 'propertyTab', selector: '[xtype="import.property"]' },
			{ ref: 'vendorTab', selector: '[xtype="import.vendor"]' },
			{ ref: 'invoiceTab', selector: '[xtype="import.invoice"]' },
			{ ref: 'userTab', selector: '[xtype="import.user"]' },
			{ ref: 'customFieldTab', selector: '[xtype="import.customField"]' },
			{ ref: 'splitsTab', selector: '[xtype="import.splits"]' }
		],
		
	file_upload: null,
	
	init: function() {
		Ext.log('Import controller initialized');

		var app = this.application;

		// Setup event handlers
		this.control({
			// Clicking on an import in an Overview tab
			'[xtype="import.overview"] tabpanel': {
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('Import.onTabChange() running');
					
					var activeTab = Ext.getClassName(newCard).split('.').pop();
					this.addHistory('Import:showImport:' + activeTab);
				}
			},
			// The Upload button on the GL Category tab
			'[xtype="import.gl"] [xtype="shared.button.upload"]': {
				// Run this whenever the upload button is clicked
				//click: this.uploadGL
                                click: function() {
                                    this.showGrid('glCategories_1375523737.csv');
                                }
			},
			// The Cancel button on the GL Category tab
			'[xtype="import.gl"] [xtype="shared.button.cancel"]': {
				// Run this whenever the upload button is clicked
				click: function() {
					this.addHistory('Import:showImport');
				}
			},
                        // The Upload csv file
			'[xtype="import.csvgrid"] [xtype="shared.button.save"]': {
				// Run this whenever the upload button is clicked
				click: function() {
					that = this;
                                        var grid =  Ext.ComponentQuery.query('[xtype="import.csvgrid"]')[0];
                                        var accounts = grid.getSelectionModel().getSelection(); 
                                        Ext.each(accounts, function(account) {
                                            that.saveCSV(account.data);
                                        });	
				}
			},
                        // The Cancel button
			'[xtype="import.csvgrid"] [xtype="shared.button.cancel"]': {
				// Run this whenever the upload button is clicked
				click: function() {
                                        this.addHistory('Import:showImport');
				}
			},
		});
	},
	
	/**
	 * Shows the import page with a specific tab open
	 * @param {String} [activeTab="overview"] The tab currently active
	 */
	showImport: function(activeTab) {
		// Set the overview view
		var tabPanel = this.setView('NP.view.import.Main');

		// If no active tab is passed, default to Open
		if (!activeTab) activeTab = 'overview';
				
		// Check if the tab to be selected is already active, if it isn't make it the active tab
		var tab = Ext.ComponentQuery.query('[xtype="import.' + activeTab + '"]')[0];
		var tabPanel = Ext.ComponentQuery.query('tabpanel')[0];
		
		// Set the active tab if it hasn't been set yet
		if (tab.getXType() != tabPanel.getActiveTab().getXType()) {
			tabPanel.setActiveTab(tab);
		}
	},
	
	/**
	 * Displays the page for the Display tab
	 */
	showGrid: function(file) {
		    // Create the view
                    var grid = this.setView('NP.view.import.CSVGrid', {file : file});

                    // Load the store
                    grid.reloadFirstPage();
	},

        saveCSV: function(account) {
		NP.lib.core.Net.remoteCall({
			method  : 'POST',
			requests: {
				service : 'GLService',
				action  : 'saveCSV',
                                account : account,
				success : function(result, deferred) {
					if (result.success) {							
						// Show friendly message
						NP.Util.showFadingWindow({ html: 'Data from csv file saved' });
					} else {
						if (result.errors.length) {
							NP.Util.showFadingWindow({ html: 'Data from csv file not saved. Errors:' + result.errors[0] });
						}
					}
				},
				failure: function() {
					Ext.log('Error save csv file');
				}
			}
		});
		
	},
	uploadGL: function() {
		var that = this;
		var formSelector = '[xtype="import.gl"] form';
		var form = Ext.ComponentQuery.query(formSelector)[0];

		// If form is valid, submit it
		if (form.getForm().isValid()) {
			var formEl = NP.Util.createFormForUpload(formSelector);
			var file = form.getForm().findField('file_upload_category').getValue();
			NP.lib.core.Net.remoteCall({
				method  : 'POST',
				isUpload: true,
				form    : formEl.id,
				requests: {
					service : 'GLService',
					action  : 'uploadCSV',
					file      : file,
					success : function(result, deferred, response) {
						if (result.success) {							
							// Show friendly message
							NP.Util.showFadingWindow({ html: 'File <b>'+ result.upload_filename +' </b>was successfully upload' });
                                                        that.showGrid(result.upload_filename);
                                                } else {
							if (result.errors.length) {
								form.getForm().findField('file_upload_category').markInvalid(result.errors[0]);
							}
						}
						Ext.removeNode(formEl);
					},
					failure: function() {
						Ext.log('Error upload csv file');
					}
				}
			});
		}
	}
});