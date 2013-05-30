/**
 * The Admin controller deals with operations in the Administration section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.CatalogMaintenance', {
	extend: 'Ext.app.Controller',
	
	requires: [
		'NP.lib.core.Net',
		'NP.lib.core.Config',
		'NP.lib.core.Util',
		'NP.lib.core.Security',
		'NP.store.catalog.VcCats',
		'NP.view.catalogMaintenance.CatalogFormUploadLogo',
		'NP.view.catalogMaintenance.CatalogFormUploadInfoPdf'
	],
	
	vc_has_pdf: null,

	init: function() {
		Ext.log('Admin controller initialized');

		var app = this.application;

		// Setup event handlers
		this.control({
			// Clicking on a Vendor Catalog Maintenance tab
			'[xtype="catalogmaintenance.catalogregister"]': {
				tabchange: this.changeGridTab
			},

			'[xtype="catalogmaintenance.cataloggrid"]': {
				// Clicking on an Activated Vendor Catalog grid inactivate/activate button
				cellclick: function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					// Only take action if the click happened on the inactivate button
					if (e.target.tagName == 'IMG') {
						if (grid.type == 'activated') {
							this.toggleActivation(record);
						} else if (grid.type == 'pending') {
							this.deleteCatalog(grid, record);	
						}
					} else {
						this.openCatalog(grid, record);
					}
				}
			},

			// Clicking on the New Catalog button
			'#newCatalogBtn': {
				click: function() {
					this.application.addHistory('CatalogMaintenance:showCatalogForm');
				}
			},

			'[xtype="catalogmaintenance.catalogforminfo"]': {
				// Changing catalog type radio button on catalog form
				changetype: this.changeCatalogType,
				// Changing the Vendor combo box selection
				selectvendor: this.selectCatalogVendor
			},

			// Clicking on the Save Catalog button
			'[xtype="catalogmaintenance.catalogform"] [xtype="shared.button.save"]': {
				click: this.saveCatalog
			},

			// Clicking on the Cancel button
			'[xtype="catalogmaintenance.catalogform"] [xtype="shared.button.cancel"]': {
				click: function() {
					this.application.addHistory('CatalogMaintenance:showRegister');
				}
			},

			// Clicking the Back catalog button
			'[xtype="catalogmaintenance.catalogview"] [xtype="shared.button.back"]': {
				click: function() {
					this.application.addHistory('CatalogMaintenance:showRegister');
				}
			},

			// Clicking the Edit catalog button
			'[xtype="catalogmaintenance.catalogview"] [xtype="shared.button.edit"]': {
				click: function() {
					this.application.addHistory('CatalogMaintenance:showCatalogForm:' + this.vc.get('vc_id'));
				}
			},

			// Clicking the Upload Vendor Logo button
			'[xtype="catalogmaintenance.catalogview"] [xtype="shared.button.camera"]': {
				click: this.showUploadLogo
			},

			// Clicking on Save button on Upload Vendor Logo form
			'[xtype="catalogmaintenance.catalogformuploadlogo"] [xtype="shared.button.save"]': {
				click: this.saveLogo
			},

			// Rendering of the logo image
			'[xtype="catalogmaintenance.catalogformuploadlogo"] image': {
				render: function(img) {
					// This is to make sure the layout updates when a new image is loaded
                    img.getEl().on('load', function() {
                        img.ownerCt.doLayout();
                    });
				}
			},

			// Clicking on Cancel button on Upload Vendor Logo form
			'[xtype="catalogmaintenance.catalogformuploadlogo"] [xtype="shared.button.cancel"]': {
				click: function() {
					this.application.getComponent('catalogmaintenance.catalogformuploadlogo').destroy();
				}
			},

			// Clicking the Remove button on Upload Vendor Logo form
			'[xtype="catalogmaintenance.catalogformuploadlogo"] form button': {
				click: this.removeLogo
			},

			// Clicking the Upload Vendor Logo button
			'[xtype="catalogmaintenance.catalogview"] [xtype="shared.button.upload"]': {
				click: this.showUploadPdf
			},

			// Clicking the Activate or Inactivate button
			'[xtype="catalogmaintenance.catalogview"] [xtype="shared.button.activate"],[xtype="catalogmaintenance.catalogview"] [xtype="shared.button.inactivate"]': {
				click: function() {
					var that = this;
					var vc = this.application.getComponent('catalogmaintenance.catalogview').vc;
					this.toggleActivation(vc).then({
						success: function() {
							that.updateActivationButton(vc);
						}
					});
				}
			},

			// Clicking on Save button on Upload Info PDF form
			'[xtype="catalogmaintenance.catalogformuploadinfopdf"] [xtype="shared.button.save"]': {
				click: this.savePdf
			},

			// Clicking on Save button on Upload Info PDF form
			'[xtype="catalogmaintenance.catalogformuploadinfopdf"] [xtype="shared.button.cancel"]': {
				click: function() {
					this.application.getComponent('catalogmaintenance.catalogformuploadinfopdf').destroy();
				}
			},

			// Clicking View Existing button on Upload Info PDF form
			'[xtype="catalogmaintenance.catalogformuploadinfopdf"] #viewCatalogPdfBtn': {
				click: this.viewPdf
			},

			// Clicking Remove button on Upload Info PDF form
			'[xtype="catalogmaintenance.catalogformuploadinfopdf"] #removeCatalogPdfBtn': {
				click: this.removePdf
			}
		});

		// Load the Catalog Categories store
		this.application.loadStore('catalog.VcCats', 'NP.store.catalog.VcCats');
	},

	changeGridTab: function(tabPanel, newCard, oldCard, eOpts) {
		Ext.log('Catalog onTabChange() running');
		
		this.application.addHistory('CatalogMaintenance:showRegister:' + newCard.type);
	},

	openCatalog: function(grid, record) {
		this.application.addHistory('CatalogMaintenance:showCatalog:' + record.get('vc_id'));
	},

	showRegister: function(activeTab) {
		// Create the view
		var tabPanel = this.application.setView('NP.view.catalogMaintenance.CatalogRegister');
		
		// If no active tab is passed, default to Open
		if (!activeTab) var activeTab = 'activated';
		
		// Check if the tab to be selected is already active, if it isn't make it the active tab
		var tab = Ext.ComponentQuery.query('[xtype="catalogmaintenance.cataloggrid"][type="'+activeTab+'"]')[0];

		// Set the active tab if it hasn't been set yet
		if (tab.getXType() != tabPanel.getActiveTab().getXType()) {
			tabPanel.setActiveTab(tab);
		}

		// Load the store
		tab.reloadFirstPage();
	},

	toggleActivation: function(record) {
		if (record.get('vc_status') == 0 || record.get('vc_status') == -1) {
			var newStatus = 1;
		} else if (record.get('vc_status') == 1) {
			var newStatus = 0;
		} else {
			throw 'Catalog status can only be changed for catalogs that are pending, active, or inactive.'
		}

		return NP.lib.core.Net.remoteCall({
			requests: {
				service: 'CatalogService',
				action : 'setCatalogStatus',
				vc_id    : record.get('vc_id'),
				vc_status: newStatus,
				success: function(result, deferred) {
					record.set('vc_status', newStatus);
					deferred.resolve(newStatus);
				}
			}
		});
	},

	deleteCatalog: function(grid, record) {
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
						}
					}
				});
			}
		});
	},

	showCatalogForm: function(vc_id) {
		var that = this;

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

	    var form = Ext.create('NP.view.catalogMaintenance.CatalogForm', {
			bind           : bindCfg,
			hideEditButtons: (vc_id) ? false : true,
			listeners      : {
				dataloaded: function(boundForm, data) {
					// Store value that isn't a part of any form to use with the PDF upload if needed
					that.vc_has_pdf = data['vc_has_pdf'];

					var field = boundForm.findField('vendor_id');
					field.setRawValue(data['vc_vendorname']);
					field.disable();

					// Set the assignment fields
					Ext.each(['categories','properties','vendors'], function(tab) {
						var cmp = that.application.getComponent('catalogmaintenance.catalogform' + tab);
						// If the tab is visible, set the value
						if (!cmp.tab.hidden) {
							cmp.setValue(data['vc_' + tab]);
						}
					});

					// Load the vendor assignment store based on the tax ID for the current catalog
					var vendorAssignCmp = that.application.getComponent('catalogmaintenance.catalogformvendors');
					vendorAssignCmp.getStore().getProxy().extraParams.vendor_fedid = data['vc_unique_id'];
					vendorAssignCmp.getStore().load();
				}
			}
		});

		this.application.setView(form);
	},

	selectCatalogVendor: function(combo, records, eOpts) {
		var that = this;

		// We need to clear the stores for the item selector, otherwise it'll keep adding new records to it
		var itemSelec = that.application.getComponent('catalogmaintenance.catalogformvendors');
		itemSelec.fromField.getStore().removeAll();
		itemSelec.toField.getStore().removeAll();

		// Now change the store parameters and reload the store; this will update the Vendor Assignment options
		itemSelec.getStore().getProxy().extraParams.vendor_id = records[0].get('vendor_id');
		itemSelec.getStore().load();
	},

	changeCatalogType: function(container, newCatalogType, oldCatalogType) {
		var that = this;

		var catalogImpl = Ext.create('NP.view.catalogMaintenance.types.' + Ext.util.Format.capitalize(newCatalogType));

        var children = container.query('>');
        
        var removable = false;
        Ext.each(children, function(comp, idx) {
            if (removable) {
                container.remove(comp);
            } else if (comp.getXType() == 'fieldcontainer') {
                removable = true;
            }
        });

        container.add(catalogImpl.getFields());
        var tabPanel = this.application.getComponent('tabpanel');
        var activeTab = tabPanel.getActiveTab();

        Ext.each(['categories','properties','vendors','posubmission'], function(tab) {
        	var cmp = that.application.getComponent('catalogmaintenance.catalogform' + tab);
        	cmp.tab.hide();
        });

        var visibleTabs = catalogImpl.getVisibleTabs();
        Ext.each(visibleTabs, function(tab) {
        	var cmp = that.application.getComponent('catalogmaintenance.catalogform' + tab);
        	cmp.tab.show();
        });

        tabPanel.setActiveTab(activeTab);
	},

	saveCatalog: function() {
		var that = this;
		var form = this.application.getComponent('catalogmaintenance.catalogform');

		// Check if form is valid
		if (form.isValid()) {
			// Get model to make pre-save changes
			var vc = form.getModel('catalog.Vc');
			vc.set('vc_lastupdatedt', new Date());
			vc.set('vc_lastupdateby', NP.lib.core.Security.getUser().get('userprofile_id'));

			// Form is valid so submit it using the bound model
			form.submitWithBindings({
				service: 'CatalogService',
				action : 'saveCatalog',
				extraFields: {
					vendor_id    : 'vendor_id',
					catalog_file : 'catalog_file',
					vc_categories: 'vc_categories',
					vc_vendors   : 'vc_vendors',
					vc_properties: 'vc_properties'
				},
				success: function(result, deferred) {
					// Show info message
					NP.Util.showFadingWindow({ html: 'Catalog saved successfully' });

					that.application.addHistory('CatalogMaintenance:showCatalog:' + result.vc['vc_id']);
				}
			});
		}
	},

	showCatalog: function(vc_id) {
		var that = this;

		NP.lib.core.Net.remoteCall({
			requests: {
				service    : 'CatalogService',
				action     : 'get',
				vc_id      : vc_id,
				success: function(result, deferred) {
					that.vc = Ext.create('NP.model.catalog.Vc', result);
					var view = that.application.setView('NP.view.catalogMaintenance.CatalogView', {
						title: that.vc.get('vc_catalogname')
					});
					var type = Ext.util.Format.capitalize(that.vc.get('vc_catalogtype'));
        			var catalogImpl = Ext.create('NP.view.catalogMaintenance.types.' + type);
        			catalogImpl.getView(that.vc).then({
        				success: function(subView) {
        					view.add(subView);
        					that.updateActivationButton(that.vc);
        				}
        			});
				}
			}
		});
	},

	updateActivationButton: function(vc) {
		var that = this;
		var btns = ['shared.button.activate','shared.button.inactivate'];
		var visibility = [false,false];
		if (vc.get('vc_status') == -1 || vc.get('vc_status') == 0) {
			visibility = [true,false];
		} else if (vc.get('vc_status') == 1) {
			visibility = [false,true];
		}
		Ext.Array.each(btns, function(val, idx) {
			that.application.getComponent(val).setVisible(visibility[idx]);
		});
	},

	showUploadLogo: function() {
		var win = Ext.create('NP.view.catalogMaintenance.CatalogFormUploadLogo', { vc_logo_filename: this.vc.get('vc_logo_filename') }).show();
	},

	saveLogo: function() {
		var that = this;
		var formSelector = '[xtype="catalogmaintenance.catalogformuploadlogo"] form';
		var form = Ext.ComponentQuery.query(formSelector)[0];
		
		// If form is valid, submit it
		if (form.getForm().isValid()) {
			var formEl = NP.Util.createFormForUpload(formSelector);

			NP.lib.core.Net.remoteCall({
				method  : 'POST',
				isUpload: true,
				form    : formEl.id,
				requests: {
					service : 'CatalogService',
					action  : 'saveCatalogLogo',
					vc      : that.vc.getData(),
					success : function(result, deferred) {
						if (result.success) {
							// Update the model
							that.vc.set('vc_logo_filename', result.vc_logo_filename);

							// Update the image
							form.query('image')[0].setSrc('clients/' + NP.lib.core.Config.getAppName() + '/web/images/logos/' + that.vc.get('vc_logo_filename')); 
							
							// Make sure the image section is showing
							form.query('container')[0].show();

							// Show friendly message
							NP.Util.showFadingWindow({ html: 'Logo was successfully saved' });
						} else {
							if (result.errors.length) {
								form.getForm().findField('logo_file').markInvalid(result.errors[0]);
							}
						}
						Ext.removeNode(formEl);
					},
					failure: function() {
						Ext.log('Error saving catalog vendor logo');
					}
				}
			});
		}
	},

	removeLogo: function() {
		var that = this;

		Ext.MessageBox.confirm('Delete Logo?', 'Are you sure you want to delete this logo?', function(btn) {
			// If user clicks Yes, proceed with deleting
			if (btn == 'yes') {
				NP.lib.core.Net.remoteCall({
					method  : 'POST',
					requests: {
						service : 'CatalogService',
						action  : 'removeCatalogLogo',
						vc      : that.vc.getData(),
						success : function(result, deferred) {
							that.vc.set('vc_logo_filename', null);
							var container = Ext.ComponentQuery.query('[xtype="catalogmaintenance.catalogformuploadlogo"] form container')[0];
							container.hide();
							container.query('image')[0].setSrc('');
							NP.Util.showFadingWindow({ html: 'Logo was successfully removed' });
						},
						failure: function() {
							Ext.log('Error removing catalog vendor logo');
						}
					}
				});
			}
		});
	},

	showUploadPdf: function() {
		Ext.create('NP.view.catalogMaintenance.CatalogFormUploadInfoPdf', { vc_has_pdf: this.vc_has_pdf }).show();
	},

	savePdf: function() {
		var that = this;

		var formSelector = '[xtype="catalogmaintenance.catalogformuploadinfopdf"] form';
		var form = Ext.ComponentQuery.query(formSelector)[0];
		
		// If form is valid, submit it
		if (form.getForm().isValid()) {
			var formEl = NP.Util.createFormForUpload(formSelector);

			NP.lib.core.Net.remoteCall({
				method  : 'POST',
				isUpload: true,
				form    : formEl.id,
				requests: {
					service : 'CatalogService',
					action  : 'saveCatalogPdf',
					vc      : that.vc.getData(),
					success : function(result, deferred) {
						if (result.success) {
							// Change flag to indicate this catalog now has a PDF
							that.vc_has_pdf = true;

							// Make sure the image section is showing
							form.query('container')[0].show();
							
							// Show friendly message
							NP.Util.showFadingWindow({ html: 'PDF was successfully saved' });
						} else {
							if (result.errors.length) {
								form.getForm().findField('pdf_file').markInvalid(result.errors[0]);
							}
						}
						Ext.removeNode(formEl);
					},
					failure: function() {
						Ext.log('Error saving catalog vendor logo');
					}
				}
			});
		}		
	},

	viewPdf: function() {
		var pdfUrl = 'clients/' + NP.lib.core.Config.getAppName() + '/web/exim_uploads/catalog/pdf/' + this.vc.get('vc_id') + '.pdf';
		window.open(pdfUrl);
	},

	removePdf: function() {
		var that = this;
		
		Ext.MessageBox.confirm('Delete PDF?', 'Are you sure you want to delete this PDF?', function(btn) {
			// If user clicks Yes, proceed with deleting
			if (btn == 'yes') {
				NP.lib.core.Net.remoteCall({
					method  : 'POST',
					requests: {
						service : 'CatalogService',
						action  : 'removeCatalogPdf',
						vc      : that.vc.getData(),
						success : function(result, deferred) {
							// Change flag to indicate this catalog no longer has a PDF
							that.vc_has_pdf = false;

							// Hide the options to remove and view logo
							var container = Ext.ComponentQuery.query('[xtype="catalogmaintenance.catalogformuploadinfopdf"] form container')[0];
							container.hide();
						
							// Show friendly message
							NP.Util.showFadingWindow({ html: 'PDF was successfully removed' });
						},
						failure: function() {
							Ext.log('Error removing catalog PDF');
						}
					}
				});
			}
		});
	}
});