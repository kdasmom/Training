/**
 * The Admin controller deals with operations in the Administration section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.CatalogMaintenance', {
	extend: 'Ext.app.Controller',
	
	requires: ['NP.lib.core.Net'],
	
	init: function() {
		Ext.log('Admin controller initialized');

		var app = this.application;

		// Setup event handlers
		this.control({
			// Clicking on a Vendor Catalog Maintenance tab
			'[xtype="catalogmaintenance.register"]': {
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('Catalog onTabChange() running');
					
					var activeTab = newCard.getXType().split('.');
					activeTab = activeTab[activeTab.length-1].replace('grid', '');
					this.application.addHistory('CatalogMaintenance:showRegister:' + activeTab);
				}
			},

			'[xtype="catalogmaintenance.gridactivated"]': {
				// Clicking on an Activated Vendor Catalog grid inactivate/activate button
				cellclick: function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					// Only take action if the click happened on the inactivate button
					if (e.target.tagName == 'IMG') {
						var newStatus = (record.get('vc_status') == 1) ? 0 : 1;
						NP.lib.core.Net.remoteCall({
							requests: {
								service: 'CatalogService',
								action : 'setCatalogStatus',
								vc_id    : record.get('vc_id'),
								vc_status: newStatus,
								success: function(result, deferred) {
									record.set('vc_status', newStatus);
								}
							}
						});
					}
				},
				// Clicking on a catalog grid record
				itemclick: this.catalogGridClick
			},

			// Clicking on a Pending Vendor Catalog grid delete button
			'[xtype="catalogmaintenance.gridpending"]': {
				cellclick: function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					// Only take action if the click happened on the delete button
					if (e.target.tagName == 'IMG') {
						// Show confirm dialog
						Ext.MessageBox.confirm('Delete Catalog?', 'Are you sure you want to delete this pending vendor catalog?', function(btn) {
							// If user clicks Yes, proceed with deleting
							if (btn == 'yes') {
								// Ajax request to delete catalog
								NP.lib.core.Net.remoteCall({
									requests: {
										service: 'CatalogService',
										action : 'deleteCatalog',
										vc_id    : record.get('vc_id'),
										success: function(result, deferred) {
											// Once deleted, remove the record from the store so it's taken off the grid
											grid.getStore().remove(record);
											// Stop event from bubbling
											e.stopEvent();
										}
									}
								});
							}
						});
					}
				},
				// Clicking on a catalog grid record
				itemclick: this.catalogGridClick
			},

			// Clicking on the New Catalog button
			'#newCatalogBtn': {
				click: function() {
					this.application.addHistory('CatalogMaintenance:showCatalogForm');
				}
			},

			// Clicking on the Save Catalog button
			'[xtype="catalogmaintenance.form"] [xtype="shared.button.save"]': {
				click: function() {
					var that = this;
					var form = this.application.getComponent('catalogmaintenance.catalogform');

					if (form.isValid()) {
						form.submitWithBindings({
							service: 'CatalogService',
							action : 'saveCatalog',
							extraFields: {
								vendor_id   : 'vendor_id',
								catalog_file: 'catalog_file'
							},
							success: function(result, deferred) {
								if (result.success) {
									var vc = form.getModel('catalog.Vc');
									// If dealing with an Excel catalog, redirect to the Pending register
									if (vc.get('vc_catalogtype') == 'excel') {
										that.application.addHistory('CatalogMaintenance:register:pending');
									// Otherwise redirect to the catalog view page
									} else {
										that.application.addHistory('CatalogMaintenance:showCatalog:' + result.vc_id);
									}
									// Show info message
									NP.Util.showFadingWindow({ html: 'Catalog saved successfully' });
								}
							}
						});
					}
				}
			},

			// Clicking on the Edit Catalog button
			'[xtype="catalogmaintenance.view"] [xtype="shared.button.edit"]': {
				click: function() {
					var vc_id = this.application.getComponent('catalogmaintenance.view').getVcId();
					this.application.addHistory('CatalogMaintenance:showCatalogForm:' + vc_id);
				}
			}
		});
	},

	catalogGridClick: function(gridView, record, item, index, e, eOpts) {
		if (record.get('vc_status') != -2) {
			this.application.addHistory('CatalogMaintenance:showCatalog:' + record.get('vc_id'));
		}
	},

	showRegister: function(activeTab) {
		// Create the view
		var tabPanel = this.application.setView('NP.view.catalogMaintenance.Register');
		
		// If no active tab is passed, default to Open
		if (!activeTab) var activeTab = 'activated';
		
		// Check if the tab to be selected is already active, if it isn't make it the active tab
		var tab = this.application.getComponent('catalogmaintenance.grid' + activeTab);
		
		// Set the active tab if it hasn't been set yet
		if (tab.getXType() != tabPanel.getActiveTab().getXType()) {
			tabPanel.setActiveTab(tab);
		}

		// Load the store
		tab.reloadFirstPage();
	},

	showCatalogForm: function(vc_id) {
		var bindCfg = {
			models   : ['catalog.Vc']
	    };

	    if (vc_id) {
	    	Ext.apply(bindCfg, {
				service    : 'CatalogService',
				action     : 'get',
				extraParams: {
		            vc_id: vc_id
		        }
	    	});
	    }

		var form = Ext.create('NP.view.catalogMaintenance.Form', {
			bind: bindCfg,
			listeners: {
				dataloaded: function(boundForm, data) {
					var field = boundForm.findField('vendor_id');
					field.setRawValue(data['vc_vendorname']);
					field.disable();
				}
			}
		});
		this.application.setView(form);
	},

	showCatalog: function(vc_id) {
		this.application.setView('NP.view.catalogMaintenance.View', { vc_id: vc_id });
	}
});