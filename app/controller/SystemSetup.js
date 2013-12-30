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

	views: ['systemSetup.Main','systemSetup.DefaultSplitGrid','systemSetup.DefaultSplitForm'],

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
		{ ref: 'addSplitAllocBtn',      selector: '#addSplitAllocBtn' },
                { ref: 'workflowScreen',        selector: '[xtype="systemsetup.WorkflowRulesMain"]'},
                { ref: 'workflowScreenGrid',    selector: '[xtype="systemsetup.WorkflowRulesGrid"]'}
	],
	
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






            '#buttonWorkflowCancel': {
                click: function() {
                    me.addHistory('SystemSetup:showSystemSetup');
                }
            },
            '#buttonWorkflowCreateRule': {
                click: function() {
                    me.addHistory('SystemSetup:showSystemSetup:WorkflowRules:modify');
                }
            },
            '#buttonWorkflowPrint': {
                click: function() {
                    Ext.MessageBox.alert('Print', 'Coming soon')
                }
            },
            '#buttonWorkflowReport': {
                click: function() {
                    Ext.MessageBox.alert('Print', 'Coming soon')
                }
            },
            '#buttonWorkflowActivateRule': {
                click: this.workflowRuleChangeStatus.bind(this, 1)
            },
            '#buttonWorkflowDeactivateRule': {
                click: this.workflowRuleChangeStatus.bind(this, 2)
            },

            '[xtype="systemsetup.WorkflowRulesGrid"]': {
                cellclick: this.workflowCellClickProcess.bind(this)
            }
        });
    },

    showWorkflowRules: function(section, id) {
        var me = this;
        switch (section) {
            case 'modify':
                var view = me.getWorkflowScreen();
                if (view) {
                    var mask = new Ext.LoadMask({
                        target: view
                    });
                    mask.show();
                }
                NP.lib.core.Net.remoteCall({
                    requests: {
                        service: 'WFRuleService',
                        action : 'get',

                        id: id,

                        success: function(data) {
                            if (data) {
                                view && mask.destroy();

                                me.setView('NP.view.systemSetup.WorkflowRulesModify', {data: data}, '[xtype="systemsetup.workflowrules"]');
                                
                                //Ext.create('NP.view.systemSetup.' + 'WorkflowRulesModify', {data: data}).show();
                                //me.addHistory('SystemSetup:showSystemSetup:WorkflowRules:modify:' + rec.get('wfrule_id'), {data: data});
                            }
                        }
                    }
                });
                break;
            default:
                var view = 'WorkflowRulesMain';
                this.setView('NP.view.systemSetup.' + view, {}, '[xtype="systemsetup.workflowrules"]');
        }
    },

    workflowCellClickProcess: function(view, td, cellIndex, rec, tr, rowIndex, e) {
        var me = this,
            grid = this.getWorkflowScreenGrid();
        switch (cellIndex) {
            case 0:
                // Selection. Nothing to do.
                break;
            case 5:
                // Copy rule
                var mask = new Ext.LoadMask({
                    target: me.getWorkflowScreen()
                });
                mask.show();
                NP.lib.core.Net.remoteCall({
                    requests: {
                        service: 'WFRuleService',
                        action : 'copy',

                        id: rec.get('wfrule_id'),

                        success: function(data) {
                            if (data) {
                                mask.destroy();
                                grid.store.reload();
                            }
                        }
                    }
                });
                break;
            case 6:
                // Delete Rule
                Ext.MessageBox.confirm(
                    'Delete Rule',
                    'Are you sure you want to delete this rule?',
                    function(button) {
                        if (button == 'yes') {
                            var mask = new Ext.LoadMask({
                                target: me.getWorkflowScreen()
                            });
                            mask.show();
                            NP.lib.core.Net.remoteCall({
                                requests: {
                                    service: 'WFRuleService',
                                    action : 'delete',

                                    id: rec.get('wfrule_id'),

                                    success: function(data) {
                                        if (data) {
                                            mask.destroy();
                                            grid.store.reload();
                                        }
                                    }
                                }
                            });
                        }
                    }
                );
                break;
            case 7:
                // View Rule
                mask = new Ext.LoadMask({
                    target: me.getWorkflowScreen()
                });
                mask.show();
                NP.lib.core.Net.remoteCall({
                    requests: {
                        service: 'WFRuleService',
                        action : 'get',

                        id: rec.get('wfrule_id'),

                        success: function(data) {
                            if (data) {
                                mask.destroy();
                                Ext.create('NP.view.systemSetup.' + 'WorkflowRulesView', {data: data}).show();
                            }
                        }
                    }
                });
                break;
            default:
                // Edit Rule
                me.addHistory('SystemSetup:showSystemSetup:WorkflowRules:modify:' + rec.get('wfrule_id'));
                break;
        }
    },
    workflowRuleChangeStatus: function(action) {
        var grid = this.getWorkflowScreenGrid();
        if (grid) {
            var selection = grid.getSelectionModel().getSelection();
            if (selection) {
                var identifiers = [];
                for (var i = 0, l = selection.length; i < l; i++) {
                    identifiers.push(selection[i].internalId);
                }
                if (identifiers.length > 0) {
                    // Identifiers are ready to be passed to the server.
                        var mask = new Ext.LoadMask({
                            target: this.getWorkflowScreen()
                        });
                        mask.show();
                        NP.lib.core.Net.remoteCall({
                            requests: {
                                service: 'WFRuleService',
                                action : 'status',

                                id: identifiers,
                                status: action,

                                success: function(data) {
                                    if (data) {
                                        mask.destroy();
                                        grid.store.reload();
                                    }
                                }
                            }
                        });
                }
            }
        }
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
	}
});