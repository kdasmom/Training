/**
 * The Invoice controller deals with operations in the Invoice section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.Invoice', {
	extend: 'NP.lib.core.AbstractController',
	
	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security'
	],
	
	stores: ['invoice.Invoices','system.PriorityFlags','invoice.InvoicePaymentTypes',
			'invoice.InvoiceItems','invoice.InvoicePayments'],
	
	views: ['invoice.Register','invoice.View'],

	refs: [
		{ ref: 'invoiceView', selector: '[xtype="invoice.view"]' },
		{ ref: 'invoiceViewToolbar', selector: '[xtype="invoice.viewtoolbar"]' },
		{ ref: 'lineView', selector: '[xtype="shared.invoicepo.viewlines"]' },
		{ ref: 'lineGrid', selector: '[xtype="shared.invoicepo.viewlinegrid"]' },
		{ ref: 'forwardsGrid', selector: '[xtype="shared.invoicepo.forwardsgrid"]' },
		{ ref: 'historyLogGrid', selector: '[xtype="shared.invoicepo.historyloggrid"]' },
		{ ref: 'paymentGrid', selector: '[xtype="invoice.viewpayments"]' },
		{ ref: 'warningsView', selector: '[xtype="shared.invoicepo.viewwarnings"] dataview' },
		{ ref: 'lineGridPropertyCombo',selector: '#lineGridPropertyCombo' },
		{ ref: 'lineGridGlCombo',      selector: '#lineGridGlCombo' },
		{ ref: 'lineGridUnitCombo',    selector: '#lineGridUnitCombo' }
	],

	showInvoiceImage: true,

	init: function() {
		Ext.log('Invoice controller initialized');

		var app = this.application;

		// Setup event handlers
		this.control({
			// Clicking on an Invoice Register tab
			'[xtype="invoice.register"]': {
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('Invoice.onTabChange() running');
					
					var activeTab = newCard.getItemId().replace('invoice_grid_', '').toLowerCase();
					this.addHistory('Invoice:showRegister:' + activeTab);
				}
			},
			
			// Clicking on an invoice in an Invoice Register grid
			'[xtype="invoice.register"] > grid': {
				itemclick: function(gridView, record, item, index, e, eOpts) {
					this.addHistory( 'Invoice:showView:' + record.get('invoice_id') );
				}
			},
			
			// Clicking on cancel button on the invoice view page
			'[xtype="invoice.viewtoolbar"] [xtype="shared.button.cancel"]': {
				click: function() {
					Ext.util.History.back();
				}
			},

			// Making a change to the context picker (picking from drop-down or clicking radio button)
			'#invoiceRegisterContextPicker': {
				change: function(toolbar, filterType, selected) {
					var contentView = app.getCurrentView();
					// If user picks a different property/region and we're on a register, update the grid
					if (contentView.getXType() == 'invoice.register') {
						var activeTab = contentView.query('tabpanel')[0].getActiveTab();
						if (activeTab.getStore) {
							this.loadRegisterGrid(activeTab);
						}
					}
				}
			},

			'[xtype="invoice.view"]': {
				destroy: this.onInvoiceViewDestroy
			},

			'[xtype="invoice.view"] [xtype="shared.invoicepo.viewlinegrid"]': {
				beforeedit          : Ext.bind(this.onBeforeInvoiceLineGridEdit, this),
				edit                : Ext.bind(this.onAfterInvoiceLineGridEdit, this),
				selectjcfield       : Ext.bind(this.onSelectJcField, this),
				selectutilityaccount: Ext.bind(this.onSelectUtilityAccount, this),
				selectusagetype     : Ext.bind(this.onSelectUsageType, this),
				changequantity      : Ext.bind(this.onChangeQuantity, this),
				changeunitprice     : Ext.bind(this.onChangeUnitPrice, this),
				changeamount        : Ext.bind(this.onChangeAmount, this)
			},

			// Vendor combo on the invoice view page
			'#invoiceVendorCombo': {
				select: this.onVendorComboSelect
			},

			// Invoice image panel
			'[xtype="viewport.imagepanel"]': {
				expand: function() {
					this.showInvoiceImage = true;
					this.loadImage(true);
				},
				collapse: function() {
					this.showInvoiceImage = false;
				}
			}
		});
	},
	
	/**
	 * Reloads a register grid, passing the current context to its store proxy, and moving it back to page 1
	 * @private
	 * @param {Ext.grid.Panel} grid
	 */
	loadRegisterGrid: function(grid) {
		var state = Ext.ComponentQuery.query('[xtype="shared.contextpicker"]')[0].getState();
		grid.addExtraParams({
			contextType     : state.type,
			contextSelection: state.selected
		});

		grid.reloadFirstPage();
	},

	/**
	 * Shows the invoice register page with a specific tab open
	 * @param {String} [activeTab="open"] The tab currently active
	 */
	showRegister: function(activeTab) {
		// Set the register view
		this.setView('NP.view.invoice.Register');

		// If no active tab is passed, default to Open
		if (!activeTab) var activeTab = 'open';
		
		// Check if the tab to be selected is already active, if it isn't make it the active tab
		var tab = Ext.ComponentQuery.query('#invoice_grid_' + activeTab)[0];
		var tabPanel = Ext.ComponentQuery.query('tabpanel')[0];
		
		// Set the active tab if it hasn't been set yet
		if (tab.getItemId() != tabPanel.getActiveTab().getItemId()) {
			tabPanel.setActiveTab(tab);
		}
		
		// Load the store
		this.loadRegisterGrid(tab);
	},
	
	/**
	 * Shows the invoice add/edit page
	 * @param {Number} [invoice_id] Id of the invoice to edit; if not provided, will show page for adding invoice
	 */
	showView: function(invoice_id) {
		var me      = this,
			forwardStore,
			viewCfg = {
				bind: {
			    	models: ['invoice.Invoice']
			    }
			};

		if (invoice_id) {
			Ext.apply(viewCfg.bind, {
				service    : 'InvoiceService',
				action     : 'get',
				extraParams: { invoice_id: invoice_id },
				extraFields: ['associated_pos']
			});

			Ext.apply(viewCfg, {
				listeners      : {
					dataloaded: function(boundForm, data) {
						me.buildViewToolbar(data);
						
						// Add integration package to the line grid
						me.getLineGrid().propertyStore.addExtraParams({
							integration_package_id: data['integration_package_id']
						});
						me.getLineGrid().propertyStore.load();

						// Set the title
						me.setInvoiceViewTitle();

						var vendorField   = boundForm.findField('vendor_id'),
							propertyField = boundForm.findField('property_id'),
							periodField   = boundForm.findField('invoice_period'),
							payByField    = boundForm.findField('invoicepayment_type_id');

						// Set the vendor
						vendorField.setDefaultRec(Ext.create('NP.model.vendor.Vendor', data));
						/*vendorField.addExtraParams({
							property_id: data['property_id']
						});
						me.onVendorComboSelect();

						// Set the property
						propertyField.setDefaultRec(Ext.create('NP.model.property.Property', data));
						// Add valid periods to the invoice period store
						me.populatePeriods(data['accounting_period'], data['invoice_period']);

						// Set the value for the period field; we need to do it manually because the BoundForm
						// tries to set a date object (from the model) on the field, but since we're not dealing
						// with a date field it doesn't work
						periodField.setValue(data['invoice_period']);

						// Set the invoice payment to the default if needed
						if (payByField.getValue() === null || payByField.getValue() === 0) {
							me.setDefaultPayBy();
						}

						// Initiate some stores that depend on an invoice_id
						Ext.each(['WarningsView','HistoryLogGrid','ForwardsGrid'], function(viewName) {
							var store = me['get'+viewName]().getStore();
							store.addExtraParams({ invoice_id: invoice_id });
							store.load();
						});

						// Load image if needed
						me.loadImage();*/
					}
				}
			});
		}

		var form = me.setView('NP.view.invoice.View', viewCfg);

		if (invoice_id) {
			var lineView     = me.getLineView(),
				lineStore    = me.getLineView().getStore(),
				paymentGrid  = me.getPaymentGrid(),
				paymentStore = paymentGrid.getStore();

			// Add invoice_id to the line and payment stores
			lineStore.addExtraParams({ invoice_id: invoice_id });
			//paymentStore.addExtraParams({ invoice_id: invoice_id });

			// Load the line store
			lineStore.load(function() {
				// Only load the payment store after the line store because we need the total amount
				/*paymentGrid.totalAmount = lineView.getTotalAmount();
				paymentStore.load(function() {
					if (paymentStore.getCount()) {
						me.getPaymentGrid().show();
					}
				});*/
			});
		} else {
			// Set the title
			me.setInvoiceViewTitle();

			// Enable the vendor and property field when dealing with a new invoice
			form.findField('vendor_id').enable();
			form.findField('property_id').enable();

			me.setDefaultPayBy();
		}
	},

	onBeforeInvoiceLineGridEdit: function(editor, e) {
		var me    = this,
			field = e.column.getEditor();

		me.getLineGrid().selectedRec = e.record;
		me.originalRecValue = e.record.copy();

		if (e.field == 'glaccount_id') {
			me.onOpenGlAccountEditor(editor, e.record, field);
		} else if (e.field == 'unit_id') {
			me.onOpenUnitEditor(editor, e.record);
		} else if (e.field == 'vcitem_number' || e.field == 'vcitem_uom') {
			me.onOpenVcItemEditor(editor, e.record, field);
		} else if (e.field == 'jbcontract_id') {
			me.onOpenContractEditor(editor, e.record, field);
		} else if (e.field == 'jbchangeorder_id') {
			me.onOpenChangeOrderEditor(editor, e.record, field);
		} else if (e.field == 'jbjobcode_id') {
			me.onOpenJobCodeEditor(editor, e.record, field);
		} else if (e.field == 'jbphasecode_id') {
			me.onOpenPhaseCodeEditor(editor, e.record, field);
		} else if (e.field == 'jbcostcode_id') {
			me.onOpenCostCodeEditor(editor, e.record, field);
		} else if (e.field == 'utilityaccount_id') {
			me.onOpenUtilityAccountEditor(editor, e.record, field);
		} else if (e.field == 'utilitycolumn_usagetype_id') {
			me.onOpenUsageTypeEditor(editor, e.record, field);
		} else if (e.field.substr(0, 15) == 'universal_field') {
			me.onOpenCustomFieldEditor(editor, e.record, field);
		}
	},

	onOpenGlAccountEditor: function(editor, rec, field) {
		var me    = this,
			combo = me.getLineGridGlCombo();

		me.loadGlAccountStore(rec);
	},

	loadGlAccountStore: function(rec, callback) {
		var me    = this,
    		store = me.getLineGrid().glStore;

    	// Only run this if property/GL association is on
		if (NP.Config.getSetting('CP.PROPERTYGLACCOUNT_USE') == '1') {
            var property_id = rec.get('property_id');

            if (property_id !== null) {
            	if (property_id != store.getExtraParam('property_id')) {
            		store.addExtraParams({ property_id: property_id });
            		store.load(function() {
            			if (callback) {
            				callback(store);
            			}
            		});
                }
            } else {
                store.removeAll();
            }
        // Otherwise run code for associating with integration package
        } else {
        	var integration_package_id = me.getInvoiceNew().getLoadedData().integration_package_id;
        	if (integration_package_id != store.getExtraParam('integration_package_id')) {
        		store.addExtraParams({ integration_package_id: integration_package_id });
        		store.load(function() {
        			if (callback) {
        				callback(store);
        			}
        		});
    		}
        }
	},

	onOpenUnitEditor: function(editor, rec, field) {
		var me    = this,
    		combo = me.getLineGridUnitCombo();

    	me.loadUnitStore(rec, function(store) {
    		combo.setValue(rec.get('unit_id'));
    	});
	},

	loadUnitStore: function(rec, callback) {
		var me          = this,
    		store       = me.getLineGrid().unitStore,
    		property_id = rec.get('property_id');

    	if (property_id !== null) {
        	if (property_id != store.getExtraParam('property_id')) {
        		store.addExtraParams({ property_id: property_id });
        		store.load(function() {
        			if (callback) {
        				callback(store);
        			}
        		});
            }
        } else {
            store.removeAll();
        }
	},

	onOpenCustomFieldEditor: function(editor, rec, customField) {
		var field = customField.field,
			store,
			fieldNumber,
			glaccount_id,
			extraParams;

		// Check if the custom field is a combo box
		if (field.getStore) {
			// If the custom field is a combo, get the store and extract the field number
			store = field.getStore();
			fieldNumber = field.getName().substr(15, 1);

			// If we're dealing with line custom field 1, need to look into the GL association
			if (fieldNumber == 1) {
				// If the GL is not blank, proceed
				glaccount_id = rec.get('glaccount_id');
				if (glaccount_id !== null) {
					// Check if the GL Account has changed or has not yet been set
					extraParams = store.getExtraParams();
					if (!('glaccount_id' in extraParams) || extraParams['glaccount_id'] != glaccount_id) {
						// If GL account is new, add it to the store and load it
						store.addExtraParams({ glaccount_id: rec.get('glaccount_id') });
						store.load();
					}
				// If the GL is blank, just clear the store
				} else {
					store.removeAll();
				}
			// If not dealing with line custom field 1, just load the store
			} else {
				store.load();
			}
		}
	},

	onOpenVcItemEditor: function(editor, rec, field) {
		if (rec.get('is_from_catalog') === 1) {
			field.setReadOnly(false);
		} else {
			field.setReadOnly(true);
		}
	},

	onOpenContractEditor: function(editor, rec, field) {
		var me            = this,
			store         = field.getStore(),
			vendorField   = me.getInvoiceView().findField('vendor_id'),
			vendor_id     = vendorField.getValue(),
			vendorsite_id = vendorField.findRecordByValue(vendor_id).get('vendorsite_id'),
			extraParams   = store.getExtraParams();
		
		if (!('vendorsite_id' in extraParams) || extraParams['vendorsite_id'] != vendorsite_id) {
			store.addExtraParams({
				vendorsite_id: vendorsite_id
			});

			store.load()
		}
	},

	onOpenChangeOrderEditor: function(editor, rec, field) {
		var me                  = this,
			store               = field.getStore(),
			jbcontract_id       = rec.get('jbcontract_id'),
			current_contract_id = null,
			extraParams         = store.getExtraParams();

		if ('jbcontract_id' in extraParams) {
			current_contract_id = extraParams['jbcontract_id'];
		}
		
		/* If a contract has been specified and it's not the same as the one currently
		used by the store, we need to load the change orders that belong to the
		selected contract */
		if (jbcontract_id !== current_contract_id && jbcontract_id !== null) {
			// Add the contract ID to the store
			store.addExtraParams({
				jbcontract_id: jbcontract_id
			});

			// Load the data into the store
			store.load();
		// Otherwise if no contract was selected, we need to clear the store
		} else if (jbcontract_id === null) {
			store.removeAll();
		}
	},

	onOpenJobCodeEditor: function(editor, rec, field) {
		var me               = this,
			store            = field.getStore(),
			jbcontract_id    = rec.get('jbcontract_id'),
			jbchangeorder_id = rec.get('jbchangeorder_id'),
			property_id      = rec.get('property_id'),
			extraParams      = store.getExtraParams(),
			newExtraParams   = {
				service: 'JobCostingService',
                action : 'getJobCodes'
			};

		if (property_id !== null) {
			// We want to see if extra params have changed to 
			Ext.each(['property_id','jbcontract_id','jbchangeorder_id'], function(field) {
				var val = eval(field);
				if (val !== null) {
					newExtraParams[field] = val;
				}
			});
			
			/* If a contract has been specified and it's not the same as the one currently
			used by the store, we need to load the change orders that belong to the
			selected contract */
			if (Ext.JSON.encode(extraParams) != Ext.JSON.encode(newExtraParams)) {
				// Add the extra parameters to the store
				store.setExtraParams(newExtraParams);

				// Load the data into the store
				store.load();
			}
		} else {
			store.removeAll();
		}
	},

	onOpenPhaseCodeEditor: function(editor, rec, field) {
		var me               = this,
			store            = field.getStore(),
			jbcontract_id    = rec.get('jbcontract_id'),
			jbchangeorder_id = rec.get('jbchangeorder_id'),
			jbjobcode_id     = rec.get('jbjobcode_id'),
			extraParams      = store.getExtraParams(),
			newExtraParams   = {
				service: 'JobCostingService',
                action : 'getPhaseCodes'
			};

		if (jbjobcode_id !== null) {
			// We want to see if extra params have changed to 
			Ext.each(['jbcontract_id','jbchangeorder_id','jbjobcode_id'], function(field) {
				var val = eval(field);
				if (val !== null) {
					newExtraParams[field] = val;
				}
			});
			
			/* If a contract has been specified and it's not the same as the one currently
			used by the store, we need to load the change orders that belong to the
			selected contract */
			if (Ext.JSON.encode(extraParams) != Ext.JSON.encode(newExtraParams)) {
				// Add the extra parameters to the store
				store.setExtraParams(newExtraParams);

				// Load the data into the store
				store.load();
			}
		} else {
			store.removeAll();
		}
	},

	onOpenCostCodeEditor: function(editor, rec, field) {
		var me               = this,
			store            = field.getStore(),
			jbcontract_id    = rec.get('jbcontract_id'),
			jbchangeorder_id = rec.get('jbchangeorder_id'),
			jbjobcode_id     = rec.get('jbjobcode_id'),
			jbphasecode_id   = rec.get('jbphasecode_id'),
			extraParams      = store.getExtraParams(),
			newExtraParams   = {
				service: 'JobCostingService',
                action : 'getCostCodes'
			};

		if (jbjobcode_id !== null) {
			// We want to see if extra params have changed to 
			Ext.each(['jbcontract_id','jbchangeorder_id','jbjobcode_id','jbphasecode_id'], function(field) {
				var val = eval(field);
				if (val !== null) {
					newExtraParams[field] = val;
				}
			});
			
			/* If a contract has been specified and it's not the same as the one currently
			used by the store, we need to load the change orders that belong to the
			selected contract */
			if (Ext.JSON.encode(extraParams) != Ext.JSON.encode(newExtraParams)) {
				// Add the extra parameters to the store
				store.setExtraParams(newExtraParams);

				// Load the data into the store
				store.load();
			}
		} else {
			store.removeAll();
		}
	},

	onOpenUtilityAccountEditor: function(editor, rec, field) {
		var me = this;

		me.loadUtilityAccountStore(rec, function(store) {
			if (store.getCount() === 0) {
				field.setReadOnly(true);
			} else {
				field.setReadOnly(false);
			}
		});
	},

	loadUtilityAccountStore: function(rec, callback) {
		var me            = this,
			store         = me.getLineGrid().utilityAccountStore,
			vendorField   = me.getInvoiceView().findField('vendor_id'),
			vendor_id     = vendorField.getValue(),
			vendorsite_id = vendorField.findRecordByValue(vendor_id).get('vendorsite_id'),
			property_id   = rec.get('property_id'),
			extraParams   = store.getExtraParams(),
			newExtraParams= {
				service: 'UtilityService',
                action : 'getAccountsByVendorsite'
			};
		
		if (vendorsite_id !== null && property_id !== null) {
			// We want to see if extra params have changed to 
			Ext.each(['vendorsite_id','property_id'], function(field) {
				var val = eval(field);
				if (val !== null) {
					newExtraParams[field] = val;
				}
			});
			
			/* If a contract has been specified and it's not the same as the one currently
			used by the store, we need to load the change orders that belong to the
			selected contract */
			if (Ext.JSON.encode(extraParams) != Ext.JSON.encode(newExtraParams)) {
				// Add the extra parameters to the store
				store.setExtraParams(newExtraParams);

				// Load the data into the store
				store.load(function() {
					if (callback) {
						callback(store);
					}
				});
			}
		} else {
			store.setExtraParams({});
			store.removeAll();
		}
	},

	onOpenUsageTypeEditor: function(editor, rec, field) {
		var me = this;

		me.loadUsageTypeStore(rec, function(store) {
			if (store.getCount() === 0) {
				field.setReadOnly(true);
			} else {
				field.setReadOnly(false);
			}
		});
	},

	loadUsageTypeStore: function(rec, callback) {
		var me             = this,
			store          = me.getLineGrid().usageTypeStore,
			UtilityType_Id = rec.get('UtilityType_Id'),
			extraParams    = store.getExtraParams(),
			newExtraParams = {
				service: 'UtilityService',
                action : 'getUsageTypesByUtilityType'
			};
		
		if (UtilityType_Id !== null) {
			newExtraParams['UtilityType_Id'] = UtilityType_Id;
			
			/* If a utility account has been specified and it's not the same as the one currently
			used by the store, we need to load the usage type that belong to the
			type for the utility account */
			if (Ext.JSON.encode(extraParams) != Ext.JSON.encode(newExtraParams)) {
				// Add the extra parameters to the store
				store.setExtraParams(newExtraParams);

				// Load the data into the store
				store.load(function() {
					if (callback) {
						callback(store);
					}
				});
			}
		} else {
			store.setExtraParams({});
			store.removeAll();
		}
	},

	onAfterInvoiceLineGridEdit: function(editor, e) {
		var me    = this,
			field = e.column.getEditor(),
			grid  = me.getLineGrid();
		
		if (e.value instanceof Array) {
			grid.selectedRec.set(me.originalRecValue.getData());
		}

		// If we edited the property, we need to make sure fields with drop downs that depend
		// on the property are checked and cleared if their value no longer exists in the store
		if (e.field == 'property_id') {
			// Only run this if the property has changed
			if (e.value != e.originalValue) {
				var glaccount_id = grid.selectedRec.get('glaccount_id');
				// If there's a GL Account set in the column, proceed
				if (glaccount_id !== null) {
					// Reload the GL Account store
					me.loadGlAccountStore(e.record, function(store) {
						// If the current grid value doesn't exist in the store, clear it
						if (store.getById(glaccount_id) === null) {
							grid.selectedRec.set('glaccount_id', null);
							grid.selectedRec.set('glaccount_name', null);
							grid.selectedRec.set('glaccount_number', null);
						}
					});
				}

				// If the property changed, a unit selected under a different property
				// would never be available, so we can just clear it
				grid.selectedRec.set('unit_id', null);
				grid.selectedRec.set('unit_id_alt', null);
				grid.selectedRec.set('unit_number', null);

				var utilityaccount_id = grid.selectedRec.get('utilityaccount_id');
				// If there's a Utlity Account set in the column, proceed
				if (utilityaccount_id !== null) {
					// Reload the utility account Account store
					me.loadUtilityAccountStore(e.record, function(store) {
						// If the current grid value doesn't exist in the store, clear it
						if (store.getById(utilityaccount_id) === null) {
							me.clearUtilityAccount(grid);
						}
					});
				}
			}
		}
	},

	clearUtilityAccount: function(grid) {
		grid.selectedRec.set('utilityaccount_id', null);
		grid.selectedRec.set('UtilityAccount_AccountNumber', null);
		grid.selectedRec.set('UtilityAccount_MeterSize', null);
		grid.selectedRec.set('UtilityType_Id', null);
		grid.selectedRec.set('UtilityType', null);
	},

	clearUsageType: function(grid) {
		grid.selectedRec.set('utilitycolumn_usagetype_id', null);
		grid.selectedRec.set('UtilityColumn_UsageType_Name', null);
	},

	onSelectJcField: function(field, grid, combo, recs) {
		var me     = this,
			newRec = {};

        if (recs.length) {
			newRec[field+'_id']   = recs[0].get(field+'_id');
			newRec[field+'_name'] = recs[0].get(field+'_name');
			newRec[field+'_desc'] = recs[0].get(field+'_desc');
        } else {
            newRec[field+'_id']   = null;
			newRec[field+'_name'] = null;
			newRec[field+'_desc'] = null;
        }

        grid.selectedRec.set(newRec);
	},

	onSelectUtilityAccount: function(grid, combo, recs) {
		var me = this;

        if (recs.length) {
            var newRec = {
                utilityaccount_id           : recs[0].get('UtilityAccount_Id'),
                UtilityAccount_AccountNumber: recs[0].get('UtilityAccount_AccountNumber'),
                UtilityAccount_MeterSize    : recs[0].get('UtilityAccount_MeterSize'),
                UtilityType_Id              : recs[0].get('UtilityType_Id'),
                UtilityType                 : recs[0].get('UtilityType')
            }

        	grid.selectedRec.set(newRec);
        } else {
            me.clearUtilityAccount(grid);
        }
	},

	onSelectUsageType: function(grid, combo, recs) {
		var me = this;

        if (recs.length) {
            var newRec = {
                utilitycolumn_usagetype_id  : recs[0].get('UtilityColumn_UsageType_Id'),
                UtilityColumn_UsageType_Name: recs[0].get('UtilityColumn_UsageType_Name')
            }

        	grid.selectedRec.set(newRec);
        } else {
            me.clearUsageType(grid);
        }
	},

	onChangeQuantity: function(grid, field) {
		var unitPrice = grid.selectedRec.get('invoiceitem_unitprice'),
			qty       = field.getValue();

		grid.selectedRec.set('invoiceitem_amount', qty * unitPrice);
	},

	onChangeUnitPrice: function(grid, field) {
		var qty       = grid.selectedRec.get('invoiceitem_quantity'),
			unitPrice = field.getValue();

		grid.selectedRec.set('invoiceitem_amount', qty * unitPrice);
	},

	onChangeAmount: function(grid, field) {
		var qty   = grid.selectedRec.get('invoiceitem_quantity'),
			amount = field.getValue();

		grid.selectedRec.set('invoiceitem_unitprice', amount / qty);
	},

	setInvoiceViewTitle: function() {
		var me   = this,
			view = me.getInvoiceView();

		view.setTitle('Invoice: ' + view.getModel('invoice.Invoice').getDisplayStatus());
	},

	buildViewToolbar: function(data) {
		var me                   = this,
			invoice              = me.getInvoiceView().getModel('invoice.Invoice'),
			toolbar              = me.getInvoiceViewToolbar();

		data = data || { is_approver: false, images: [] };
		toolbar.displayConditionData = {};

		Ext.apply(toolbar.displayConditionData, Ext.apply(data, { invoice: invoice }));

		toolbar.refresh();
	},

	loadImage: function(showImage) {
		var me           = this,
			data         = me.getInvoiceView().getLoadedData(),
            user         = NP.Security.getUser(),
            isHorizontal = user.get('userprofile_splitscreen_isHorizontal'),
            imageOrder   = user.get('userprofile_splitscreen_ImageOrder'),
            hideImg      = user.get('userprofile_splitscreen_LoadWithoutImage'),
            splitSize    = user.get('userprofile_splitscreen_size'),
            imageRegion  = 'west',
            showImage    = showImage || false,
            sizeProp,
            imagePanel,
            iframeId,
            iframeEl;

		if (data['images'].length) {
			if (isHorizontal == 1) {
	            imageRegion = (imageOrder == 1) ? 'north' : 'south';
	            sizeProp = 'height';
	        } else if (isHorizontal == 0) {
	            imageRegion = (imageOrder == 1) ? 'east' : 'west';
	            sizeProp = 'width';
	        }
	        imagePanel = Ext.ComponentQuery.query('#' + imageRegion + 'Panel')[0];
	        
	        iframeId = 'invoice-image-iframe-' + imageRegion;
			iframeEl = Ext.get(iframeId);
			if (!iframeEl) {
				imagePanel[sizeProp] = splitSize + '%';

				if (hideImg != 1 || showImage) {
					imagePanel.update('<iframe id="' + iframeId + '" src="about:blank" height="100%" width="100%"></iframe>');
					iframeEl = Ext.get(iframeId);
				}
				if (hideImg != 1 && !showImage && me.showInvoiceImage) {
		        	imagePanel.expand(false);
		        	showImage = true;
		        }
		    }

		    if (showImage) {
		    	var src = 'showImage.php?image_index_id=' + data['images'][0]['Image_Index_Id'];
		    	if (iframeEl.dom.src != src) {
					iframeEl.dom.src = src;
				}
			}

			me.showInvoiceImage = showImage;

			imagePanel.show();
		}
	},

	onInvoiceViewDestroy: function() {
		var panels = Ext.ComponentQuery.query('[xtype="viewport.imagepanel"]');
		
		Ext.suspendLayouts();
		for (var i=0; i<panels.length; i++) {
			panels[i].hide();
		}
		Ext.resumeLayouts(true);
	},

	onVendorComboSelect: function() {
		var me            = this,
			vendorDisplay = Ext.ComponentQuery.query('#vendorDisplay')[0],
			vendorField   = Ext.ComponentQuery.query('#invoiceVendorCombo')[0],
			vendor        = vendorField.findRecordByValue(vendorField.getValue());

		vendorDisplay.update(
			'<b>' + vendor.get('vendor_name') + 
			' (' + vendor.get('vendor_id_alt') + ')</b>' +
			vendor.getAddressHtml() +
			'<div>' + vendor.getFullPhone() + '</div>'
		);

		vendorDisplay.show();
	},

	populatePeriods: function(accounting_period, invoice_period) {
		var accountingPeriod = Ext.Date.parse(accounting_period, 'Y-m-d'),
			startPeriod      = accountingPeriod,
			endPeriod        = accountingPeriod,
			periodBack       = parseInt(NP.Config.getSetting('CP.INVOICE_POST_DATE_BACK', '0')) * -1,
			periodForward    = parseInt(NP.Config.getSetting('CP.INVOICE_POST_DATE_FORWARD', '0')),
			currentPeriod,
			invoicePeriod    = Ext.Date.parse(invoice_period, NP.Config.getServerDateFormat()),
			periods          = [],
			periodField      = this.getCmp('invoice.view').findField('invoice_period');

		if (periodBack > 0) {
			startPeriod = Ext.Date.add(startPeriod, Ext.Date.MONTH, periodBack);
		}
		currentPeriod = startPeriod;

		if (periodForward > 0) {
			endPeriod = Ext.Date.add(endPeriod, Ext.Date.MONTH, periodForward);
		}

		while (currentPeriod <= endPeriod) {
			periods.push(currentPeriod);
			currentPeriod = Ext.Date.add(currentPeriod, Ext.Date.MONTH, 1);
		}

		if (invoicePeriod < startPeriod) {
			periods.unshift(invoicePeriod);
		} else if (invoicePeriod > endPeriod) {
			periods.push(invoicePeriod);
		}

		// Add all the periods to the store
		Ext.each(periods, function(period) {
			periodField.getStore().add({
				accounting_period_display: Ext.Date.format(period, 'm/Y'),
				accounting_period        : Ext.Date.format(period, NP.Config.getServerDateFormat())
			});
		});
	},

	setDefaultPayBy: function() {
		var me         = this,
			payByField = me.getInvoiceView().findField('invoicepayment_type_id'),
			payByStore = payByField.getStore(),
			recs;

		// Set the default once the store has loaded
		payByStore.on('load', function() {
			recs = payByStore.query('universal_field_status', 2);
			if (recs.getCount()) {
				payByField.setValue(recs.getAt(0));
			}
		}, me, { single: true });
	},

	getInvoiceRecord: function() {
		return this.getInvoiceView().getModel('invoice.Invoice');
	}
});