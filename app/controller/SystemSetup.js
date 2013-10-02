/**
 * The SystemSetup controller deals with operations in the System Setup section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.SystemSetup', {
	extend: 'NP.lib.core.AbstractController',
	
	requires: [
	    'NP.lib.core.Security',
	    'NP.lib.core.Net',
	    'NP.lib.core.Util',
	    'NP.lib.core.Config',
	],

	refs : [
		{ ref: 'passwordConfiguration', selector: '[xtype="systemsetup.passwordconfiguration"]' },
		{ ref: 'defaultSplits',         selector: '[xtype="systemsetup.defaultsplits"]' },
		{ ref: 'defaultSplitGrid',      selector: '[xtype="systemsetup.defaultsplitgrid"] customgrid' },
		{ ref: 'splitDeleteBtn',        selector: '[xtype="systemsetup.defaultsplitgrid"] [xtype="shared.button.delete"]' },
		{ ref: 'defaultSplitForm',      selector: '[xtype="systemsetup.defaultsplitform"]' },
		{ ref: 'splitFormItemGrid',     selector: '[xtype="systemsetup.defaultsplitform"] customgrid' },
		{ ref: 'splitFormVendor',       selector: '[xtype="systemsetup.defaultsplitform"] [xtype="shared.vendorautocomplete"]' },
		{ ref: 'splitFormIntPkg',       selector: '[xtype="systemsetup.defaultsplitform"] [name="integration_package_id"]' },
		{ ref: 'splitGridVendorCombo',  selector: '[xtype="systemsetup.defaultsplitform"] [xtype="shared.vendorautocomplete"]' },
		{ ref: 'splitGridPropertyCombo',selector: '#splitGridPropertyCombo' },
		{ ref: 'splitGridGlCombo',      selector: '#splitGridGlCombo' },
		{ ref: 'splitGridUnitCombo',    selector: '#splitGridUnitCombo' },
		{ ref: 'addSplitAllocBtn',      selector: '#addSplitAllocBtn' }
	],
	
	// For localization
	changesSavedText       : 'Changes saved successfully',
	errorDialogTitleText   : 'Error',
	deleteSplitDialogTitle : 'Delete Split?',
	deleteSplitsDialogText : 'Are you sure you want to delete the selected split(s)?',
	deleteSplitDialogText  : 'Are you sure you want to delete this split?',
	editSplitFormTitle     : 'Editing',
	newSplitFormTitle      : 'New Split',
	intPkgChangeDialogTitle: 'Change integration package?',
	intPkgChangeDialogText : 'Are you sure you want to change integration package? Doing so will clear the entire form, removing all splits you have entered.',
	
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
			},
			// The Split grid
			'[xtype="systemsetup.defaultsplitgrid"] customgrid': {
				// Making a selection on the grid
				selectionchange: this.selectSplit,
				cellclick: function(view, td, cellIndex, rec, tr, rowIndex, e) {
					if (cellIndex != 0) {
						this.addHistory('SystemSetup:showSystemSetup:DefaultSplits:Form:' + rec.get('dfsplit_id'));
					}
				}
			},
			// The Create New Split button
			'[xtype="systemsetup.defaultsplitgrid"] [xtype="shared.button.new"]': {
				click: function() {
					this.addHistory('SystemSetup:showSystemSetup:DefaultSplits:Form');
				}
			},
			// The Delete button on the split grid
			'[xtype="systemsetup.defaultsplitgrid"] [xtype="shared.button.delete"]': {
				click: this.deleteSplits
			},
			// The default split form integration package field
			'[xtype="systemsetup.defaultsplitform"] [name="integration_package_id"]': {
				select: function(combo) { this.selectIntegrationPackage(combo, true) }
			},
			// The default split form allocation grid
			'[xtype="systemsetup.defaultsplitform"] customgrid': {
				beforeedit: function(editor, e) {
					if (e.field == 'property_id') {
						this.openPropertyEditor(e.record);
					} else if (e.field == 'glaccount_id') {
						this.openGlAccountEditor(e.record);
					} else if (e.field == 'unit_id') {
						this.openUnitEditor(e.record);
					}
				},
				deleterow: this.deleteSplitItem,
				updateproperty: this.updateProperty
			},
			'#saveSplitFormBtn': {
				click: this.saveSplitForm
			},
			'#copySplitFormBtn': {
				click: this.copySplit
			},
			'#deleteSplitFormBtn': {
				click: this.deleteSplit
			},
			'#resetSplitFormBtn': {
				click: this.resetSplitForm
			},
			'#cancelSplitFormBtn': {
				click: function() {
					this.addHistory('SystemSetup:showSystemSetup:DefaultSplits');
				}
			},
			'#addSplitAllocBtn': {
				click: this.addSplitLine
			},
			'#autoAllocBtn': {
				click: this.autoAllocSplit
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
	},

	showDefaultSplits: function(subSection, dfsplit_id) {
		if (!subSection) subSection = 'Grid';

		this['showDfSplit' + subSection](dfsplit_id);
	},

	showDfSplitGrid: function() {
		this.setView('NP.view.systemSetup.DefaultSplitGrid', {}, '[xtype="systemsetup.defaultsplits"]');
		
		this.getDefaultSplitGrid().getStore().load();
	},

	selectSplit: function(selectionModel, selected) {
		var fn = (selected.length) ? 'enable' : 'disable';
		this.getSplitDeleteBtn()[fn]();
	},

	deleteSplits: function() {
		var that = this;

		Ext.MessageBox.confirm(this.deleteSplitDialogTitle, this.deleteSplitsDialogText, function(btn) {
			// If user clicks Yes, proceed with deleting
			if (btn == 'yes') {
				var grid = that.getDefaultSplitGrid();
				var splits = grid.getSelectionModel().getSelection();
				var dfsplit_id = [];
				Ext.each(splits, function(split) {
					grid.getStore().remove(split);
					dfsplit_id.push(split.get('dfsplit_id'));
				});

				that.deleteSplitAction(
					dfsplit_id,
					grid,
					{
						success: function() {
							// Unmark items in the grid
							grid.getStore().commitChanges();
						},
						failure: function() {
							grid.getStore().rejectChanges();
						}
					}
				);
			}
		});
	},

	deleteSplitAction: function(dfsplit_id, mask, callbacks) {
		var that = this;
		var callbacks = callbacks || {};

		NP.lib.core.Net.remoteCall({
			method  : 'POST',
			mask    : mask,
			requests: {
				service   : 'SplitService',
				action    : 'deleteSplit',
				dfsplit_id: dfsplit_id,
				success: function(result, deferred) {
					if (result.success) {
						if (callbacks.success) {
							callbacks.success();
						}
						// Show a friendly message saying action was successful
						NP.Util.showFadingWindow({ html: that.changesSavedText });
					} else {
						if (callbacks.failure) {
							callbacks.failure();
						}
						NP.Util.showFadingWindow({ html: result.error });
					}
				}
			}
		});
	},

	showDfSplitForm: function(dfsplit_id) {
		var that = this;

		// Setup the view configuration
		var viewCfg = {
			bind: {
		        models: [
		            'system.DfSplit'
		        ]
		    }
		};

		// Only do this if viewing an existing user
		if (dfsplit_id) {
			Ext.apply(viewCfg, {
		    	listeners       : {
			    	dataloaded: function(formPanel, data) {
			    		// Set the form title
			    		formPanel.setTitle(that.editSplitFormTitle + ' ' + data['dfsplit_name']);

			    		// Set the active user for easy access later
			    		that.activeSplit = formPanel.getModel('system.DfSplit');

			    		var grid = that.getSplitFormItemGrid();
			    		grid.addExtraParams({ dfsplit_id: dfsplit_id });
			    		grid.getStore().load();

			    		// Load the integration
			    		that.selectIntegrationPackage(formPanel.findField('integration_package_id'), false);

			    		// Set the vendor record
			    		if (data['vendor_id'] !== null) {
				    		that.getSplitGridVendorCombo().setDefaultRec(Ext.create('NP.model.vendor.Vendor', {
								vendor_id    : data['vendor_id'],
								vendor_name  : data['vendor_name'],
								vendor_id_alt: data['vendor_id_alt'],
								vendorsite_id: data['vendorsite_id']
				    		}));
				    		that.getSplitGridVendorCombo().resetOriginalValue();
				    	}
					}
			    }
			});

			Ext.apply(viewCfg.bind, {
				service: 'SplitService',
		        action : 'get',
		        extraParams: {
		            dfsplit_id: dfsplit_id
		        }
			});
		}

		// Create the view with the configuration defined above
		var form = that.setView('NP.view.systemSetup.DefaultSplitForm', viewCfg, '[xtype="systemsetup.defaultsplits"]', true);

		var copyBtn = Ext.ComponentQuery.query('#copySplitFormBtn')[0];
		var deleteBtn = Ext.ComponentQuery.query('#deleteSplitFormBtn')[0];

		Ext.suspendLayouts();
		
		// Only do this if we're editing a user
		if (dfsplit_id) {
			copyBtn.show();
			deleteBtn.show();
		}
		// Only do this if we're creating a new user
		else {
			// Set the form title
			form.setTitle(that.newSplitFormTitle);
			copyBtn.hide();
			deleteBtn.hide();
		}

		Ext.resumeLayouts(true);
	},

	selectIntegrationPackage: function(combo, showWarning) {
		var that = this;

		function selectIntPkg() {
			var integration_package_id = combo.getValue();

			// When changing the integration package, you basically clear the entire form
			// since everything depends on it
	        that.getSplitFormVendor().clearValue();
	        if (integration_package_id === null) {
	        	that.getSplitFormVendor().disable();
	        	that.getAddSplitAllocBtn().disable();
	        } else {
	        	that.getSplitFormVendor().getStore().addExtraParams({ integration_package_id: integration_package_id });
	        	that.getSplitFormVendor().enable();
	        	that.getAddSplitAllocBtn().enable();
	        }
	        // Remove items one at a time, otherwise we can't reset the form
	        var store = that.getSplitFormItemGrid().getStore();
	        var lineItems = store.getRange();
	        Ext.Array.each(lineItems, function(lineItem) {
	        	store.remove(lineItem);
	        });

	        // Reload the property store
	        if (that.getSplitGridPropertyCombo()) {
		        that.openPropertyEditor();
		        that.getSplitGridPropertyCombo().getStore().load();
		    }

	        combo.setFocusValue(combo.getValue());
		}

		if (showWarning && combo.getFocusValue() !== null && combo.getFocusValue() != combo.getValue()) {
			Ext.MessageBox.confirm(that.intPkgChangeDialogTitle, that.intPkgChangeDialogText, function(btn) {
				// If user clicks Yes, proceed with deleting
				if (btn == 'yes') {
					selectIntPkg();
			    } else {
			    	combo.setValue(combo.getFocusValue());
			    }
			});
		} else {
			selectIntPkg();
		}
    },

    openPropertyEditor: function() {
    	this.addIntegrationPkgToStore(this.getSplitGridPropertyCombo().getStore());
    },

    updateProperty: function(store, rec) {
    	if (rec.get('property_id') !== null) {
	    	// Only run this if a GL value is selected and property/GL association is on
	    	if (rec.get('glaccount_id') !== null && NP.Config.getSetting('CP.PROPERTYGLACCOUNT_USE') == '1') {
	    		// make sure the GL account is valid for the property selected
	    		NP.lib.core.Net.remoteCall({
	    			requests: {
						service     : 'PropertyService',
						action      : 'isGlAssigned',
						property_id : rec.get('property_id'),
						glaccount_id: rec.get('glaccount_id'),
						success     : function(result, deferred) {
							// If the GL is not assigned to the property, clear it
							if (!result) {
								rec.set('glaccount_id', null);
							}
						}
	    			}
	    		});
	    	}
	    } else {
	    	rec.set('glaccount_id', null);
	    }
    },

    openGlAccountEditor: function(rec) {
    	var that = this;

    	var glStore = this.getSplitGridGlCombo().getStore();

    	// Only run this if property/GL association is on
    	if (NP.Config.getSetting('CP.PROPERTYGLACCOUNT_USE') == '1') {
            var property_id = rec.get('property_id');

            if (property_id !== null) {
            	if (property_id != glStore.getExtraParam('property_id')) {
            		glStore.addExtraParams({ property_id: property_id });
            		glStore.load();
                }
            } else {
                glStore.removeAll();
            }
        // Otherwise run code for associating with integration package
        } else {
        	this.addIntegrationPkgToStore(glStore);
        }
    },

    openUnitEditor: function(rec) {
    	var that = this;

    	var unitStore = this.getSplitGridUnitCombo().getStore();
    	var property_id = rec.get('property_id');

    	if (property_id !== null) {
        	if (property_id != unitStore.getExtraParam('property_id')) {
        		unitStore.addExtraParams({ property_id: property_id });
        		unitStore.load();
            }
        } else {
            unitStore.removeAll();
        }
    },

    addIntegrationPkgToStore: function(store) {
    	var integration_package_id = this.getSplitFormIntPkg().getValue();
    	if (integration_package_id != store.getExtraParam('integration_package_id')) {
        	store.addExtraParams({ integration_package_id: integration_package_id });
        }
    },

    deleteSplitItem: function(grid, rec, rowIndex) {
		grid.getStore().remove(rec);
		// We call refresh to make sure the allocation gets recalculated
		grid.getView().refresh();
	},

	resetSplitForm: function() {
		this.getDefaultSplitForm().getForm().reset();
        this.getSplitFormItemGrid().getStore().rejectChanges();
        this.getSplitFormItemGrid().getStore().sort();
	},

	addSplitLine: function() {
		this.getSplitFormItemGrid().getStore().add(Ext.create('NP.model.system.DfSplitItem'));
	},

	autoAllocSplit: function() {
		function getPropertyUnits(line) {
			var propertyUnits = 0;
			var property_id = line.get('property_id');
			if (property_id !== null) {
				var prop = Ext.getStore('property.AllProperties').findRecord('property_id', property_id, 0, false, false, true);
				propertyUnits = parseFloat(prop.get('property_no_units').replace(/[^0-9.]/g, ''));
				if (isNaN(propertyUnits)) {
					propertyUnits = 0;
				}
			}
			return propertyUnits;
		}

		var grid = this.getSplitFormItemGrid();
		var store = grid.getStore();
		var lines = store.getRange();

		var totalUnits = 0;
		Ext.each(lines, function(line) {
			var propertyUnits = getPropertyUnits(line);
			totalUnits += propertyUnits;
		});

		grid.suspendEvents(false);
		store.suspendEvents(false);
		Ext.each(lines, function(line) {
			if (line.get('property_id') !== null) {
				var propertyUnits = getPropertyUnits(line);
				var percent = (propertyUnits / totalUnits) * 100;
				line.set('dfsplititem_percent', percent);
			}
		});
		grid.resumeEvents();
		store.resumeEvents();
		grid.getView().refresh();
	},

	copySplit: function() {
		var that = this;

		var splitRec = this.getDefaultSplitForm().getModel('system.DfSplit');

		NP.lib.core.Net.remoteCall({
			requests: {
				service     : 'SplitService',
				action      : 'copySplit',
				dfsplit_id  : splitRec.get('dfsplit_id'),
				success     : function(result, deferred) {
					NP.Util.showFadingWindow({ html: that.changesSavedText });
					that.addHistory('SystemSetup:showSystemSetup:DefaultSplits:Form:' + result.dfsplit_id);
				}
			}
		});
	},

	deleteSplit: function() {
		var that = this;

		Ext.MessageBox.confirm(this.deleteSplitDialogTitle, this.deleteSplitDialogText, function(btn) {
			// If user clicks Yes, proceed with deleting
			if (btn == 'yes') {
				var dfsplit_id = that.getDefaultSplitForm().getModel('system.DfSplit').get('dfsplit_id');

				that.deleteSplitAction(
					dfsplit_id,
					that.getDefaultSplitForm(),
					{
						success: function() {
							that.addHistory('SystemSetup:showSystemSetup:DefaultSplits');
						}
					}
				);
			}
		});
	},

	saveSplitForm: function() {
		var that = this;
		var form = this.getDefaultSplitForm();

		if (form.isValid()) {
			var modifiedItems = this.getSplitFormItemGrid().getStore().getModifiedRecords();
			var dfSplitItems = [];
			Ext.each(modifiedItems, function(dfSplitItem) {
				dfSplitItems.push(dfSplitItem.getData());
			});

			var removedItems = this.getSplitFormItemGrid().getStore().getRemovedRecords();
			var removedDfSplitItems = [];
			Ext.each(removedItems, function(removedItem) {
				removedDfSplitItems.push(removedItem.get('dfsplititem_id'));
			});

			form.submitWithBindings({
				service: 'SplitService',
				action : 'saveSplit',
				extraParams: {
					dfSplitItems       : dfSplitItems,
					removedDfSplitItems: removedDfSplitItems
				},
				extraFields: { vendor_id: 'vendor_id' },
				success: function(result, deferred) {
					NP.Util.showFadingWindow({ html: that.changesSavedText });
					that.addHistory('SystemSetup:showSystemSetup:DefaultSplits');
				}
			});
		}
	}
});