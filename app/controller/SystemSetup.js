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
    	'NP.lib.core.Translator'
	],

	models: ['system.DfSplit'],

	stores: ['property.Properties','gl.GlAccounts','system.DfSplits'],

	views: [
		'systemSetup.Main',
		'systemSetup.DefaultSplitGrid',
		'systemSetup.DefaultSplitForm',
		'systemSetup.SettingsTab',
		'systemSetup.CustomFieldForm'
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
	settingsActiveTab: 'general',
	
	init: function() {
		Ext.log('SystemSetup controller initialized');

		var me = this;

		// For localization
		NP.Translator.on('localeloaded', function() {
			me.changesSavedText       = NP.Translator.translate('Changes saved successfully');
			me.errorDialogTitleText   = NP.Translator.translate('Error');
			me.deleteSplitDialogTitle = NP.Translator.translate('Delete Split?');
			me.deleteSplitsDialogText = NP.Translator.translate('Are you sure you want to delete the selected split(s)?');
			me.deleteSplitDialogText  = NP.Translator.translate('Are you sure you want to delete this split?');
			me.editSplitFormTitle     = NP.Translator.translate('Editing');
			me.newSplitFormTitle      = NP.Translator.translate('New Split');
			me.intPkgChangeDialogTitle= NP.Translator.translate('Change integration package?');
			me.intPkgChangeDialogText = NP.Translator.translate('Are you sure you want to change integration package? Doing so will clear the entire form, removing all splits you have entered.');
		});

		// Setup event handlers
		me.control({
			// The main System Setup panel
			'[xtype="systemsetup.main"]': {
				// Run this whenever the user clicks on a tab on the System Setup page
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('SystemSetup onTabChange() running');
					
					var activeTab = Ext.getClassName(newCard).split('.').pop();
					me.addHistory('SystemSetup:showSystemSetup:' + activeTab);
				}
			},
			
			// The Save button on the Password Configuration page
			'[xtype="systemsetup.passwordconfiguration"] [xtype="shared.button.save"]': {
				// Run this whenever the save button is clicked
				click: me.savePasswordConfiguration
			},
			// The Split grid
			'[xtype="systemsetup.defaultsplitgrid"] customgrid': {
				// Making a selection on the grid
				selectionchange: me.selectSplit,
				cellclick: function(view, td, cellIndex, rec, tr, rowIndex, e) {
					if (cellIndex != 0) {
						me.addHistory('SystemSetup:showSystemSetup:DefaultSplits:Form:' + rec.get('dfsplit_id'));
					}
				}
			},
			// The Create New Split button
			'[xtype="systemsetup.defaultsplitgrid"] [xtype="shared.button.new"]': {
				click: function() {
					me.addHistory('SystemSetup:showSystemSetup:DefaultSplits:Form');
				}
			},
			// The Delete button on the split grid
			'[xtype="systemsetup.defaultsplitgrid"] [xtype="shared.button.delete"]': {
				click: me.deleteSplits
			},
			// The default split form integration package field
			'[xtype="systemsetup.defaultsplitform"] [name="integration_package_id"]': {
				select: function(combo) { me.selectIntegrationPackage(combo, true) }
			},
			// The default split form allocation grid
			'[xtype="systemsetup.defaultsplitform"] customgrid': {
				beforeedit: function(editor, e) {
					if (e.field == 'property_id') {
						me.openPropertyEditor(e.record);
					} else if (e.field == 'glaccount_id') {
						me.openGlAccountEditor(e.record);
					} else if (e.field == 'unit_id') {
						me.openUnitEditor(e.record);
					}
				},
				deleterow: me.deleteSplitItem,
				updateproperty: me.updateProperty
			},
			'#saveSplitFormBtn': {
				click: me.saveSplitForm
			},
			'#copySplitFormBtn': {
				click: me.copySplit
			},
			'#deleteSplitFormBtn': {
				click: me.deleteSplit
			},
			'#resetSplitFormBtn': {
				click: me.resetSplitForm
			},
			'#cancelSplitFormBtn': {
				click: function() {
					me.addHistory('SystemSetup:showSystemSetup:DefaultSplits');
				}
			},
			'#addSplitAllocBtn': {
				click: me.addSplitLine
			},
			'#autoAllocBtn': {
				click: me.autoAllocSplit
			},
			'#saveClientLogoBtn': {
				click: me.saveClientLogo
			},
			'#removeClientLogoBtn': {
				click: me.removeClientLogo
			},
			'#backToUserManagerBtn': {
				click: function() {
					me.addHistory('UserManager:showUserManager');
				}
			},
			'#backToPropertySetupBtn': {
				click: function() {
					me.addHistory('PropertySetup:showPropertySetup');
				}
			},
			'[xtype="systemsetup.settings"] [xtype="verticaltabpanel"]': {
				tabchange: me.changeSettingsTab
			},
			'[xtype="systemsetup.settings"] [xtype="shared.button.save"]': {
				click: me.saveSettings
			},
			'#backToOverview': {
				click: function() {
					me.addHistory('SystemSetup:showSystemSetup:Overview');
				}
			},
			'[xtype="systemsetup.settings"] [xtype="shared.button.cancel"]': {
				click: function() {
					me.addHistory('SystemSetup:showSystemSetup:Overview');
				}
			},
			'[xtype="systemsetup.customfields"] [xtype="systemsetup.customfieldslineitem"] [xtype="customgrid"]': {
				itemclick: function(dataview, record) {
					me.showFieldEditForm(dataview, record, true);
				}
			},
			'[xtype="systemsetup.customfields"] [xtype="systemsetup.customfieldsheader"] [xtype="customgrid"]': {
				itemclick: function(dataview, record) {
					me.showFieldEditForm(dataview, record, false);
				}
			},
			'[xtype="systemsetup.customfields"] [xtype="systemsetup.customfieldspropertyfields"] [xtype="customgrid"]': {
				itemclick: function(dataview, record) {
					me.showFieldEditForm(dataview, record, false);
				}
			},
			'[xtype="systemsetup.customfields"] [xtype="systemsetup.customfieldsservicefields"] [xtype="customgrid"]': {
				itemclick: function(dataview, record) {
					me.showFieldEditForm(dataview, record, false);
				}
			},
//			'[xtype="systemsetup.customfieldform"] [xtype="shared.button.save"]': {
			'#saveCustomFieldBtn': {
				click: me.saveCustomField
			},
			'[xtype="systemsetup.customfields"]': {
				beforehidetab: me.changeCustomFieldsTab
			},
			'[xtype="systemsetup.picklists"] [name="picklistmodes"]': {
				itemclick: me.loadPicklistColumns
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

		if (activeTab == 'Settings') {
			var generaltab = tab.down('#general');

			this.filltabContent(generaltab, this.addField);
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
				success    : function(result) {
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
					success    : function(result) {
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
				success: function(result) {
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

    openPropertyEditor: function(rec) {
    	var me    = this,
    		store = me.getSplitGridPropertyCombo().getStore(),
    		combo = me.getSplitGridPropertyCombo();

    	me.addIntegrationPkgToStore(store);
    	store.load(function() {
    		combo.setValue(rec.get('property_id'));
    	});
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
						success     : function(result) {
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
    	var me    = this,
    		combo = me.getSplitGridGlCombo(),
    		store = combo.getStore();

    	// Only run this if property/GL association is on
    	if (NP.Config.getSetting('CP.PROPERTYGLACCOUNT_USE') == '1') {
            var property_id = rec.get('property_id');

            if (property_id !== null) {
            	if (property_id != store.getExtraParam('property_id')) {
            		store.addExtraParams({ property_id: property_id });
            		store.load(function() {
            			combo.setValue(rec.get('glaccount_id'));
            		});
                }
            } else {
                store.removeAll();
            }
        // Otherwise run code for associating with integration package
        } else {
        	me.addIntegrationPkgToStore(store);
        	store.load(function() {
    			combo.setValue(rec.get('glaccount_id'));
    		});
        }
    },

    openUnitEditor: function(rec) {
    	var me          = this,
    		combo       = me.getSplitGridUnitCombo(),
    		store       = combo.getStore(),
    		property_id = rec.get('property_id');

    	if (property_id !== null) {
        	if (property_id != store.getExtraParam('property_id')) {
        		store.addExtraParams({ property_id: property_id });
        		store.load(function() {
        			combo.setValue(rec.get('unit_id'));
        		});
            }
        } else {
            store.removeAll();
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
				success     : function(result) {
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
				success: function(result) {
					NP.Util.showFadingWindow({ html: that.changesSavedText });
					that.addHistory('SystemSetup:showSystemSetup:DefaultSplits');
				}
			});
		}
	},

	showLoginPage: function() {
		var me   = this,
			form = me.getCmp('systemsetup.loginpage');

		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'ConfigService',
				action : 'getCustomLogoName',
				success: function(result) {
					form.setLogoFile(result);
				}
			}
		});
	},

	saveClientLogo: function() {
		var me   = this,
			form = me.getCmp('systemsetup.loginpage');
		
		// If form is valid, submit it
		if (form.getForm().isValid()) {
			var formEl = NP.Util.createFormForUpload('[xtype="systemsetup.loginpage"]');

			NP.Net.remoteCall({
				method  : 'POST',
				isUpload: true,
				form    : formEl.id,
				requests: {
					service  : 'ConfigService',
					action   : 'saveClientLogo',
					success : function(result) {
						if (result.success) {
							// Update the image
							form.setLogoFile(result['logo_file']);
							
							// Show friendly message
							NP.Util.showFadingWindow({
								html: NP.Translator.translate('Logo was successfully saved')
							});
						} else {
							if (result.errors.length) {
								form.getForm().findField('logo_file').markInvalid(result.errors[0]);
							}
						}
						Ext.removeNode(formEl);
					},
					failure: function() {
						Ext.log('Error saving client logo');
					}
				}
			});
		}
	},

	removeClientLogo: function() {
		var me        = this,
			form      = me.getCmp('systemsetup.loginpage'),
			container = form.down('container');

		Ext.MessageBox.confirm('Delete Logo?', 'Are you sure you want to delete this logo?', function(btn) {
			// If user clicks Yes, proceed with deleting
			if (btn == 'yes') {
				NP.lib.core.Net.remoteCall({
					method  : 'POST',
					mask    : form,
					requests: {
						service: 'ConfigService',
						action : 'removeClientLogo',
						success: function(result) {
							form.setLogoFile('');
							NP.Util.showFadingWindow({ html: 'Logo was successfully removed' });
						},
						failure: function() {
							Ext.log('Error removing client logo');
						}
					}
				});
			}
		});
	},

	/**
	 * Change tab for the "Settings"
	 *
	 * @param tabPanel
	 * @param tab
	 */
	changeSettingsTab: function(tabPanel, tab) {
		this.filltabContent(tab, this.addField);
	},

	/**
	 * Fill form
	 *
	 * @param tab
	 */
	filltabContent: function(tab, callback) {

		callback = callback || Ext.emptyFn;
		var tabName;

		switch (tab.itemId) {
			case ('general'):
			default :
				tabName =  'General';
				break;
			case ('register'):
				tabName =  'Register';
				break;
			case ('imaging'):
				tabName =  'Imaging';
				break;
			case ('invoice'):
				tabName =  'Invoice';
				break;
			case ('jobcost'):
				tabName =  'Job Cost';
				break;
			case ('purchaseorder'):
				tabName =  'Purchase Order';
				break;
			case ('vendor'):
				tabName =  'Vendor';
				break;
			case ('budget'):
				tabName =  'Budget and GL';
				break;
			case ('intl'):
				tabName =  'Intl';
				break;
		}
		this.settingsActiveTab = tab.itemId;

		var fieldcontainer = tab.down('[name="params"]');
		fieldcontainer.removeAll();
		var mask = new Ext.LoadMask({ target: tab });
		mask.show();
		NP.lib.core.Net.remoteCall({
			requests: {
				service					: 'ConfigService',
				action					: 'getConfigSysValByCat',
				configsysclient_name		: NP.lib.core.Config.getAppName(),
				configsysval_load		: null,
				configsyscat_name		: tabName,
				configsysval_show		: 1,
				success: function(success) {
					if (success.length > 0) {
						callback(tab, success, fieldcontainer);
						mask.destroy();
					}
				}
			}
		});
	},

	/**
	 * Add fields
	 * @param tab
	 * @param fields
	 * @param fieldcontainer
	 */
	addField: function(tab, fields, fieldcontainer) {
		Ext.each(fields, function(field){
			switch (field.configsystype_name) {
				case 'Text':
					fieldcontainer.add({
						xtype: 'textfield',
						name: 'setting_' + field.configsysval_id,
						fieldLabel: field.configsys_displayname,
						value: field.configsysval_val
					});
					break;
				case 'Yes/No':
					fieldcontainer.add(
						{
							xtype: 'shared.yesnofield',
							name: 'setting_' + field.configsysval_id,
							fieldLabel: field.configsys_displayname,
							value: field.configsysval_val,
							allowBlank: field.configsys_required
						}
					);
					break;
				case 'Number':
					fieldcontainer.add(
						{
							xtype: 'numberfield',
							name: 'setting_' + field.configsysval_id,
							fieldLabel: field.configsys_displayname,
							value: field.configsysval_val,
							decimalPrecision: 0,
							allowBlank: false
						}
					);
					break;
				case 'Date':
					fieldcontainer.add(
						{
							xtype: 'datefield',
							name: 'setting_' + field.configsysval_id,
							fieldLabel: field.configsys_displayname,
							value: field.configsysval_val,
							allowBlank: false
						}
					);
					break;
				case 'Lookup':
					fieldcontainer.add(
						{
							xtype: 'customcombo',
							name: 'setting_' + field.configsysval_id,
							fieldLabel: field.configsys_displayname,
							store:Ext.create('NP.store.system.ConfigSysLkpVals', {
								service    	: 'ConfigService',
								action     	: 'getConfigSysLkpVal',
								extraParams: {
									configsyslkp_id: field.configsyslkp_id
								}
							}),
							displayField: 'configsyslkpval_name',
							valueField: 'configsyslkpval_val',
							allowBlank: false,
							editable: false,
							typeAhead:false,
							listeners: {
								afterrender: function(combo, eOpts) {
									combo.getStore().load();
									combo.setValue(field.configsysval_val);
								}
							}
						}
					);
					break;
				case 'LookupMultiple':
					fieldcontainer.add(
						{
							xtype: 'customcombo',
							name: 'setting_' + field.configsysval_id,
							fieldLabel: field.configsys_displayname,
							store:Ext.create('NP.store.system.ConfigSysLkpVals', {
								service    	: 'ConfigService',
								action     	: 'getConfigSysLkpVal',
								extraParams: {
									configsyslkp_id: field.configsyslkp_id
								}
							}),
							displayField: 'configsyslkpval_name',
							valueField: 'configsyslkpval_val',
							multiple: true,
							editable: false,
							allowBlank: false,
							typeAhead:false,
							listeners: {
								afterrender: function(combo, eOpts) {
									combo.getStore().load();
									combo.setValue(field.configsysval_val);
								}
							}
						}
					);
					break;
				case 'Table':
					fieldcontainer.add(
						{
							xtype: 'customcombo',
							name: 'setting_' + field.configsysval_id,
							fieldLabel: field.configsys_displayname,
							store: Ext.create('NP.lib.data.Store', {
								service    	: 'ConfigService',
								action     	: 'getConfigSysValTable',
								extraParams: {
									tablename: field.configsys_tbl,
									configsys_tbl_name_fld: field.configsys_tbl_name_fld,
									configsys_tbl_val_fld: field.configsys_tbl_val_fld
								},
								fields: ['configsyslkpval_name', 'configsyslkpval_val']
							}),
							displayField: 'configsyslkpval_name',
							valueField: 'configsyslkpval_val',
							allowBlank: false,
							editable: false,
							typeAhead:false,
							listeners: {
								afterrender: function(combo, eOpts) {
									combo.getStore().load();
									combo.setValue(parseInt(field.configsysval_val));
								}
							}
						}
					);
					break;
				case 'Range':
					var range = field.configsys_range.split('-');
					var values = [];
					for (var index = range[0]; index <= range[1]; index++) {
						values.push([index, index]);
					}
					fieldcontainer.add({
						xtype: 'customcombo',
						name: 'setting_' + field.configsysval_id,
						fieldLabel: field.configsys_displayname,
						store: Ext.create('Ext.data.ArrayStore', {
							fields: ['configsyslkpval_val', 'configsyslkpval_name'],
							data: values
						}),
						displayField: 'configsyslkpval_name',
						valueField: 'configsyslkpval_val',
						allowBlank: false,
						editable: false,
						typeAhead:false,
						listeners: {
							afterrender: function(combo, eOpts) {
								combo.getStore().load();
								combo.setValue(field.configsysval_val);
							}
						}
					});
					break;
			}
			fieldcontainer.add(
				{
					xtype: 'hiddenfield',
					name: 'parent_id' + field.configsysval_id,
					value: field.parent_configsysval_id
				}
			);
		});
	},

	/**
	 * Save settings
	 */
	saveSettings: function() {
		var form = this.getCmp('systemsetup.settings').down('#' + this.settingsActiveTab).down('[name="params"]'),
			data = form.getValues();

		data = Ext.apply(data, {
			userprofile_id	: NP.Security.getUser().get('userprofile_id')
		});

		if (form.isValid()) {
			NP.lib.core.Net.remoteCall({
				requests: {
					service			: 'ConfigService',
					action			: 'saveSettings',
					data			: data,
					success: function(success) {
						if (success.success) {
							NP.Util.showFadingWindow({ html: 'Settings were saved successfully' });
						} else {
							NP.Util.showFadingWindow({ html: success.errors });
						}
					}
				}
			});
		}
	},

	/**
	 * Show edit form for the custom field
	 * @param dataview
	 * @param record
	 * @param lineitem
	 */
	showFieldEditForm: function(dataview, record, lineitem) {
		var me = this,
			panel = dataview.up().up(),
			tabindex = panel.name == 'headers' ? 0 : (panel.name == 'lineitems' ? 1 : (panel.name == 'servicefields' ? 2 : 3)),
			headerform = me.getCmp('systemsetup.customfieldform'),
			fid = tabindex < 2 ? parseInt(record.get('controlpanelitem_name')[record.get('controlpanelitem_name').length - (!lineitem ? 1 : 10)]) : parseInt(record.get('customfield_id'));

		if (!headerform) {
			panel.add({
				xtype: 'systemsetup.customfieldform',
				flex: 1,
				tabindex: tabindex
			});
			headerform = me.getCmp('systemsetup.customfieldform');
		}

		NP.lib.core.Net.remoteCall({
			requests: {
				service    : 'ConfigService',
				action     : 'getHeaderValues',
				fid: fid,
				tabindex: tabindex,
				success    : function(result) {
					if (result) {
						if (tabindex < 2) {
							headerform.setTitle('Custom Field ' + fid);
							headerform.getForm().findField('customfielddata').setFieldLabel((tabindex < 2 ? 'Custom Field ' : 'Field ') + fid + ' Values');
						} else {
							headerform.setTitle('Custom Field ' + record.get('controlpanelitem_name')[record.get('controlpanelitem_name').length - 1]);
							headerform.getForm().findField('customfielddata').setFieldLabel((tabindex < 2 ? 'Custom Field ' : 'Field ') + record.get('controlpanelitem_name')[record.get('controlpanelitem_name').length - 1] + ' Values');
						}
						headerform.getForm().findField('customfielddata').getStore().getProxy().extraParams.fid = fid;
						if (tabindex >= 2) {
							headerform.getForm().findField('customfielddata').getStore().getProxy().extraParams.pntype = result.customfield_pn_type;
							headerform.getForm().findField('customfielddata').getStore().getProxy().extraParams.universal_field_id = result.universal_field_number;
						}
						headerform.getForm().findField('customfielddata').getStore().load();
						headerform.getChildByElement('dataandselectfield').hide();

						if (tabindex >= 2) {
							headerform.getChildByElement('dataandselectfield').show();
							headerform.getForm().findField('custom_field_maxlength').show();
						} else {
							if (fid !== 7 && fid !== 8) {
								headerform.getForm().findField('custom_field_maxlength').hide();
								headerform.getChildByElement('dataandselectfield').show();
							} else {
								headerform.getForm().findField('custom_field_maxlength').show();
								headerform.getChildByElement('dataandselectfield').hide();
							}
						}

						headerform.getForm().findField('universal_field_number').setValue(!result['universal_field_number'] ? '' : result['universal_field_number']);
						headerform.getForm().findField('fid').setValue(parseInt(fid));
						headerform.getForm().findField('invoice_custom_field_on_off').setValue(parseInt(result['inv_custom_field_on_off']));
						headerform.getForm().findField('invoice_custom_field_req').setValue(parseInt(result['inv_custom_field_req']));
						headerform.getForm().findField('po_custom_field_on_off').setValue(parseInt(result['po_custom_field_on_off']));
						headerform.getForm().findField('po_custom_field_req').setValue(parseInt(result['po_custom_field_req']));
						headerform.getForm().findField('vef_custom_field_on_off').setValue(parseInt(result['vef_custom_field_on_off']));
						headerform.getForm().findField('vef_custom_field_req').setValue(parseInt(result['vef_custom_field_req']));
						if (tabindex == 0) {
							headerform.getForm().findField('inv_custom_field_imgindex').setValue(parseInt(result['inv_custom_field_imgindex']));
							headerform.getForm().findField('customFieldType').setValue(result['customFieldType'] == 'select' ? 0 : 1);

						}
						if (tabindex > 1) {
							headerform.getForm().findField('customFieldType').setValue(result['customfield_type'] == 'select' ? 0 : (result['customfield_type'] == '' || result['customfield_type'] == 'text' ? 3 : 2));
							headerform.getForm().findField('custom_field_lbl').setValue(result['customfield_label']);
							headerform.getForm().findField('customfield_status').setValue(result['po_on_off']);
							headerform.getForm().findField('customfield_req').setValue(result['po_req']);
						}else {
							headerform.getForm().findField('custom_field_lbl').setValue(result['custom_field_lbl']);
						}

						headerform.getForm().findField('custom_field_maxlength').setValue(tabindex < 2 ? parseInt(!result['maxlength'] ? 0 : result['maxlength']) : parseInt(!result['customfield_max_length'] ? 0 : result['customfield_max_length']));

						headerform.show();
					}
				}
			}
		});
	},

	saveCustomField: function() {
		var form = this.getCmp('systemsetup.customfieldform'),
			values = form.getValues(),
			data = {},
			me = this,
			grid = form.up().down('customgrid');

		data['universal_field_number'] = parseInt(values['universal_field_number']);
		data['fid'] = parseInt(values['fid']);
		data['islineitem'] = form.tabindex;
		data['custom_field_maxlength'] = values['custom_field_maxlength'];

		if (form.tabindex < 2) {
			data['field_inv_on_off'] = values['invoice_custom_field_on_off'];
			data['field_inv_req'] = values['invoice_custom_field_req'];
			data['field_po_on_off'] = values['po_custom_field_on_off'];
			data['field_po_req'] = values['po_custom_field_req'];
			data['field_vef_on_off'] = values['vef_custom_field_on_off'];
			data['field_vef_req'] = values['vef_custom_field_req'];
			data['field_imgindex'] = values['invoice_custom_field_imgindex'];
			data['field_lbl'] = values['custom_field_lbl'];
			data['customFieldType'] = values['customFieldType'] == 0 ? 'select' : 'date';
		} else {
			data['custom_field_lbl'] 			= values['custom_field_lbl'];
			data['customfield_req'] 			= values['customfield_req'];
			data['customfield_status']			= values['customfield_status'];
			data['customfield_type']			= values['customFieldType'] == 0 ? 'select' : (values['customFieldType'] == 2 ? 'date' : 'text');
			data['customfield_lastupdateby']	= NP.Security.getUser().get('userprofile_id');
		}

		NP.lib.core.Net.remoteCall({
			requests: {
				service    : 'ConfigService',
				action     : 'updateCustomField',
				data: data,
				success    : function(result) {
					if (result) {
						NP.Util.showFadingWindow({ html: 'Item was updated successfully!' });
						form.up().remove(form);
						grid.getStore().reload();
					}
				}
			}
		});
	},

	changeCustomFieldsTab: function(tab) {
		var me = this;
		tab.remove(me.getCmp('systemsetup.customfieldform'));
	},

	loadPicklistColumns: function (grid, record) {
		var me = this,
			columnsgrid = me.getCmp('systemsetup.picklists').down('[name="picklistcolumns"]');

		columnsgrid.getStore().getProxy().extraParams.mode = record.get('mode');
		columnsgrid.getStore().reload();
	}
});