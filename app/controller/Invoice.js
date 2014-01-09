/**
 * The Invoice controller deals with operations in the Invoice section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.Invoice', {
	extend: 'NP.lib.core.AbstractController',
	
	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security',
		'NP.lib.core.Net',
		'NP.lib.core.Translator',
		'NP.lib.core.Net',
		'NP.view.shared.invoicepo.SplitWindow'
	],
	
	models: ['NP.model.invoice.InvoiceItem'],

	stores: ['invoice.Invoices','system.PriorityFlags','invoice.InvoicePaymentTypes',
			'invoice.InvoiceItems','invoice.InvoicePayments','shared.Reasons'],
	
	views: ['invoice.Register','invoice.View','invoice.VoidWindow','invoice.HoldWindow'],

	refs: [
		{ ref: 'invoiceView', selector: '[xtype="invoice.view"]' },
		{ ref: 'invoiceViewToolbar', selector: '[xtype="invoice.viewtoolbar"]' },
		{ ref: 'invoicePropertyCombo', selector: '#invoicePropertyCombo' },
		{ ref: 'invoiceVendorCombo', selector: '#invoiceVendorCombo' },
		{ ref: 'lineMainView', selector: '[xtype="shared.invoicepo.viewlineitems"]' },
		{ ref: 'lineView', selector: '[xtype="shared.invoicepo.viewlines"]' },
		{ ref: 'lineDataView', selector: '[xtype="shared.invoicepo.viewlines"] dataview' },
		{ ref: 'lineGrid', selector: '[xtype="shared.invoicepo.viewlinegrid"]' },
		{ ref: 'forwardsGrid', selector: '[xtype="shared.invoicepo.forwardsgrid"]' },
		{ ref: 'historyLogGrid', selector: '[xtype="shared.invoicepo.historyloggrid"]' },
		{ ref: 'paymentGrid', selector: '[xtype="invoice.viewpayments"]' },
		{ ref: 'warningsView', selector: '[xtype="shared.invoicepo.viewwarnings"] dataview' },
		{ ref: 'lineGridPropertyCombo',selector: '#lineGridPropertyCombo' },
		{ ref: 'lineGridGlCombo', selector: '#lineGridGlCombo' },
		{ ref: 'lineGridUnitCombo', selector: '#lineGridUnitCombo' },
		{ ref: 'lineEditBtn', selector: '#invoiceLineEditBtn' },
		{ ref: 'splitWindow', selector: '[xtype="shared.invoicepo.splitwindow"]' },
		{ ref: 'splitGrid', selector: '[xtype="shared.invoicepo.splitwindow"] customgrid' },
		{ ref: 'splitCombo', selector: '#splitCombo'}
	],

	showInvoiceImage: true,

	init: function() {
		Ext.log('Invoice controller initialized');

		var me  = this,
			app = me.application;

		// Setup event handlers
		me.control({
			// Clicking on an Invoice Register tab
			'[xtype="invoice.register"]': {
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('Invoice.onTabChange() running');
					
					var activeTab = newCard.getItemId().replace('invoice_grid_', '').toLowerCase();
					me.addHistory('Invoice:showRegister:' + activeTab);
				}
			},
			
			// Clicking on an invoice in an Invoice Register grid
			'[xtype="invoice.register"] > grid': {
				itemclick: function(gridView, record, item, index, e, eOpts) {
					me.addHistory( 'Invoice:showView:' + record.get('invoice_id') );
				}
			},

			// Clicking on the New Invoice button
			'#newInvoiceBtn,#newInvoiceMenuBtn': {
				click: function() {
					me.addHistory('Invoice:showView');
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
						var activeTab = contentView.getActiveTab();
						if (activeTab.getStore) {
							me.loadRegisterGrid(activeTab);
						}
					}
				}
			},

			'[xtype="invoice.view"]': {
				destroy: me.onInvoiceViewDestroy
			},

			'[xtype="invoice.view"] [xtype="shared.invoicepo.viewlinegrid"]': {
				beforeedit          : me.onBeforeInvoiceLineGridEdit.bind(me),
				edit                : me.onAfterInvoiceLineGridEdit.bind(me),
				selectjcfield       : me.onSelectJcField.bind(me),
				selectutilityaccount: me.onSelectUtilityAccount.bind(me),
				selectusagetype     : me.onSelectUsageType.bind(me),
				changequantity      : me.onChangeQuantity.bind(me),
				changeunitprice     : me.onChangeUnitPrice.bind(me),
				changeamount        : me.onChangeAmount.bind(me)
			},

			// Property combo on the invoice view page
			'#invoicePropertyCombo': {
				select: me.onPropertyComboSelect
			},

			// Vendor combo on the invoice view page
			'#invoiceVendorCombo': {
				select      : me.onVendorComboSelect
			},

			// Invoice image panel
			'[xtype="viewport.imagepanel"]': {
				expand: function() {
					me.showInvoiceImage = true;
					me.loadImage(true);
				},
				collapse: function() {
					me.showInvoiceImage = false;
				}
			},

			// Clicking the Edit button on the line item list
			'#invoiceLineEditBtn': {
				click: me.onLineEditClick.bind(me)
			},

			// Clicking on the Add Line button
			'#invoiceLineAddBtn': {
				click: me.onLineAddClick.bind(me)
			},

			// Clicking on the Done With Changes button
			'#invoiceLineSaveBtn': {
				click: me.onLineSaveClick.bind(me)
			},

			// Clicking on the Undo Changes button
			'#invoiceLineCancelBtn': {
				click: me.onLineCancelClick.bind(me)
			},

			// Line item view
			'[xtype="shared.invoicepo.viewlines"]': {
				// Clicking the Split link on a line item
				clicksplitline : me.onSplitLineClick.bind(me),
				clickeditsplit : me.onSplitLineClick.bind(me),
				clickdeleteline: me.onDeleteLineClick.bind(me)
			},

			// Split grid
			'[xtype="shared.invoicepo.splitwindow"] customgrid': {
				beforeedit      : me.onBeforeInvoiceLineGridEdit.bind(me),
				changepercentage: me.onChangeSplitPercentage.bind(me),
				changeamount    : me.onChangeSplitAmount.bind(me)
			},

			// Split combo box in the split window
			'#splitCombo': {
				select: me.onSelectSplit.bind(me)
			},

			// Button to add a split line
			'#splitLineAddBtn': {
				click: me.onAddSplitLine.bind(me)
			},

			// Button to recalculate split amounts
			'#recalculateBtn': {
				click: me.onRecalculateSplit.bind(me)
			},

			// Button to save split
			'#saveSplitBtn': {
				click: me.onSaveSplit.bind(me)
			},

			// Button to show the void popup
			'#invoiceVoidBtn': {
				click: me.onShowVoidInvoice.bind(me)
			},

			'#invoiceVoidCancelBtn': {
				click: me.onCancelVoidInvoice.bind(me)
			},

			'#invoiceVoidSaveBtn': {
				click: me.onSaveVoidInvoice.bind(me)
			},

			// Button to show the void popup
			'#invoiceOnHoldBtn': {
				click: me.onShowOnHoldInvoice.bind(me)
			},

			'#invoiceOnHoldCancelBtn': {
				click: me.onCancelOnHoldInvoice.bind(me)
			},

			'#invoiceOnHoldSaveBtn': {
				click: me.onSaveOnHoldInvoice.bind(me)
			},

			'#activateBtn': {
				click: me.onActivateInvoice.bind(me)
			},

			'#invoiceSaveBtn': {
				click: me.onSaveInvoice
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
						// Check if the invoice needs to be made readonly
						if (me.isInvoiceReadOnly()) {
							me.makeInvoiceReadOnly();
						} else {
							me.getLineEditBtn().enable();
						}
						
						// Set the title
						me.setInvoiceViewTitle();

						// Build the toolbar
						me.buildViewToolbar(data);
						
						var lineView     = me.getLineView(),
							lineStore    = me.getLineDataView().getStore(),
							paymentGrid  = me.getPaymentGrid(),
							paymentStore = paymentGrid.getStore();

						// Add invoice_id to the line and payment stores
						lineStore.addExtraParams({ invoice_id: invoice_id });
						paymentStore.addExtraParams({ invoice_id: invoice_id });

						// Load the line store
						lineStore.load(function() {
							// Only load the payment store after the line store because we need the total amount
							paymentGrid.totalAmount = lineView.getTotalAmount();
							paymentStore.load(function() {
								if (paymentStore.getCount()) {
									me.getPaymentGrid().show();
								}
							});
						});

						var vendorField   = boundForm.findField('vendor_id'),
							propertyField = boundForm.findField('property_id'),
							periodField   = boundForm.findField('invoice_period');

						// Set the vendor
						vendorField.setDefaultRec(Ext.create('NP.model.vendor.Vendor', data));
						vendorField.addExtraParams({
							property_id: data['property_id']
						});
						me.setVendorDisplay();

						// Set the property
						propertyField.setDefaultRec(Ext.create('NP.model.property.Property', data));
						// Add valid periods to the invoice period store
						me.populatePeriods(data['accounting_period'], data['invoice_period']);
						me.setPropertyFieldState(data['invoice_status']);

						// Set the value for the period field; we need to do it manually because the BoundForm
						// tries to set a date object (from the model) on the field, but since we're not dealing
						// with a date field it doesn't work
						periodField.setValue(data['invoice_period']);

						// Set the invoice payment to the default if needed
						if (NP.Config.getSetting('CP.INVOICE_PAY_BY_FIELD', '0') == '1') {
							var payByField = boundForm.findField('invoicepayment_type_id');
							if (payByField.getValue() === null || payByField.getValue() === 0) {
								me.setDefaultPayBy();
							}
						}

						// Initiate some stores that depend on an invoice_id
						Ext.each(['WarningsView','HistoryLogGrid','ForwardsGrid'], function(viewName) {
							var store = me['get'+viewName]().getStore();
							store.addExtraParams({ invoice_id: invoice_id });
							store.load();
						});

						// Load image if needed
						me.loadImage();
					}
				}
			});
		}

		var form = me.setView('NP.view.invoice.View', viewCfg, '#contentPanel', true);

		if (!invoice_id) {
			// Set the title
			me.setInvoiceViewTitle();

			me.buildViewToolbar();

			// Enable the property field when dealing with a new invoice
			form.findField('property_id').enable();

			me.setDefaultPayBy();
		}
	},

	setPropertyFieldState: function(invoice_status) {
		var me    = this,
			field = me.getInvoicePropertyCombo();

		// Only allow changing the property field if the invoice is open and user has one of
		// the following permissions: 'New Invoice', 'Modify Any', 'Modify Only Created';
		// OR if the invoice is completed, user has 'Invoice Post Approval Modify' permission,
		// and post approval modify is turned on
		if (
			(
				invoice_status == 'open'
				&& (
					NP.Security.hasPermission(1032) 
					|| NP.Security.hasPermission(6076) 
					|| NP.Security.hasPermission(6077)
				)
			)
			|| (
				invoice_status == 'saved' 
				&& NP.Security.hasPermission(1068) 
				&& NP.Config.getSetting('PN.InvoiceOptions.SkipSave') == '0'
			)
		) {
			field.enable();
		} else {
			field.disable();
		}		
	},

	getVendorRecord: function() {
		var me          = this,
			vendorField = me.getInvoiceView().findField('vendor_id');

		return vendorField.findRecordByValue(vendorField.getValue());
	},

	onLineEditClick: function() {
		this.getLineMainView().getLayout().setActiveItem(1);
	},

	onLineAddClick: function() {
		var me = this;
		
		me.getLineGrid().getStore().add(Ext.create('NP.model.invoice.InvoiceItem'));
	},

	onLineSaveClick: function() {
		var me = this;
		
		if (me.validateLineItems()) {
			me.getLineMainView().getLayout().setActiveItem(0);
		}
	},

	validateLineItems: function() {
		var me    = this,
			grid  = me.getLineGrid(),
			store = grid.getStore(),
			count = store.getCount(),
			reqFields = ['glaccount_id','property_id'],
			valid = true,
			rec,
			col,
			cellNode;

		for (var i=0; i<count; i++) {
			rec = store.getAt(i);
			for (var j=0; j<grid.columns.length; j++) {
				col = grid.columns[j];
				if (Ext.Array.contains(reqFields, col.dataIndex) && rec.get(col.dataIndex) == null) {
					cellNode = grid.getView().getCell(rec, col);
					cellNode.addCls('grid-invalid-cell');
					cellNode.set({
						'data-qtip': 'This field is required'
					});
					valid = false;
				}
			}
		}

		return valid;
	},

	onLineCancelClick: function() {
		var me = this;
		
		me.getLineGrid().getStore().rejectChanges();
	},

	onBeforeInvoiceLineGridEdit: function(editor, e) {
		var me    = this,
			field = e.column.getEditor(),
			grid  = e.grid;

		grid.selectedRec = e.record;
		me.originalRecValue = e.record.copy();

		cellNode = grid.getView().getCell(e.record, e.column);
		cellNode.removeCls('grid-invalid-cell');
		cellNode.set({
			'data-qtip': ''
		});

		if (e.field == 'invoiceitem_quantity' || e.field == 'invoiceitem_unitprice' 
				|| e.field == 'invoiceitem_amount' || e.field == 'invoiceitem_description') {
			me.onOpenInvalidSplitField(editor, e.record, field);
		} else if (e.field == 'property_id') {
			me.onOpenPropertyEditor(editor, e.grid, e.record, field);
		} else if (e.field == 'glaccount_id') {
			me.onOpenGlAccountEditor(editor, e.grid, e.record, field);
		} else if (e.field == 'unit_id') {
			me.onOpenUnitEditor(editor, e.grid, e.record);
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

	onOpenInvalidSplitField: function(editor, rec, field) {
		if (rec.get('invoiceitem_split') === 1) {
			field.setReadOnly(true);
		} else {
			field.setReadOnly(false);
		}
	},

	onOpenPropertyEditor: function(editor, grid, rec, field) {
		this.loadPropertyStore(grid.propertyStore);
	},

	loadPropertyStore: function(store, callback) {
		var me    = this,
			propertyField = me.getInvoicePropertyCombo(),
    		property_id   = propertyField.getValue(),
			integration_package_id;

		if (property_id !== null) {
			integration_package_id = propertyField.findRecordByValue(property_id).get('integration_package_id')
		}

		if (integration_package_id) {
	    	if (integration_package_id != store.getExtraParam('integration_package_id')) {
	    		store.addExtraParams({ integration_package_id: integration_package_id });
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

	onOpenGlAccountEditor: function(editor, grid, rec, field) {
		this.loadGlAccountStore(grid.glStore, rec);
	},

	loadGlAccountStore: function(store, rec, callback) {
		var me    = this;

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
        	var integration_package_id = me.getInvoiceView().getLoadedData().integration_package_id;
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

	onOpenUnitEditor: function(editor, grid, rec, field) {
		var me    = this,
    		combo = me.getLineGridUnitCombo();

    	me.loadUnitStore(grid.unitStore, rec, function(store) {
    		combo.setValue(rec.get('unit_id'));
    	});
	},

	loadUnitStore: function(store, rec, callback) {
		var me          = this,
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
			vendorsite_id = me.getVendorRecord().get('vendorsite_id'),
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
			vendorsite_id = me.getVendorRecord().get('vendorsite_id'),
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
		var me        = this,
			field     = e.column.getEditor(),
			grid      = me.getLineGrid(),
			intCombos = ['property_id','glaccount_id','unit_id','jbcontract_id','jbchangeorder_id',
						'jbjobcode_id','jbphasecode_id','jbcostcode_id','utilityaccount_id',
						'utilitycolumn_usagetype_id'];
		
		if (Ext.Array.contains(intCombos, field.getName()) && (e.value instanceof Array || isNaN(e.value))) {
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

	onPropertyComboSelect: function(propertyCombo, recs) {
		var me          = this,
			vendorCombo = me.getInvoiceVendorCombo();

		if (recs.length) {
			vendorCombo.enable();
		} else {
			vendorCombo.disable();
		}
	},

	onVendorComboSelect: function(combo, recs) {
		var me          = this,
			invoice_id  = me.getInvoiceRecord().get('invoice_id'),
			vendorField = me.getInvoiceVendorCombo(),
			dialogTitle = NP.Translator.translate('Change Vendor?'),
			dialogText  = NP.Translator.translate('Please note, when changing the vendor, all line items and previous approvals will be deleted from this invoice. Are you sure you want to proceed?');

		function restoreVendor() {
			var vendorStore = vendorField.getStore(),
				idx         = vendorStore.indexOf(me.selectedVendor),
				fn          = (idx === -1) ? 'setDefaultRec' : 'setValue';
			
			vendorField.suspendEvents(false);
			
			vendorField[fn](me.selectedVendor);

			vendorField.resumeEvents();
		}

		if (me.selectedVendor) {
			Ext.MessageBox.confirm(dialogTitle, dialogText, function(btn) {
				// If user clicks Yes, proceed with deleting
				if (btn == 'yes') {
					// If dealing with a new invoice, we don't need to do an Ajax request
					if (invoice_id === null) {
						me.changeVendor();
					// Ajax request to change vendor
					} else {
						me.checkLock(function() {
							NP.Net.remoteCall({
								mask    : me.getInvoiceView(),
								requests: {
									service   : 'InvoiceService',
									action    : 'changeVendor',
									invoice_id: invoice_id,
									vendor_id : vendorField.getValue(),
									success   : function(result) {
										if (!result.success) {
											Ext.MessageBox.alert(
												NP.Translator.translate('Error'),
												NP.Translator.translate('An unexpected error occurred. Please try again.')
											);

											restoreVendor();
										} else {
											NP.Util.showFadingWindow({
												html: NP.Translator.translate('The vendor has been changed')
											});

											me.changeVendor();
										}
									}
								}
							});
						});
					}
				} else {
					restoreVendor();
				}
			});
		} else {
			me.changeVendor();
		}
	},

	changeVendor: function() {
		var me         = this,
			invoice_id = me.getInvoiceRecord().get('invoice_id'),
			form       = me.getInvoiceView(),
			formData   = form.getLoadedData(),
			vendor     = me.getVendorRecord();

		Ext.suspendLayouts();

		// Show the vendor info
		me.setVendorDisplay();

		// Remove all line items
		me.getLineGrid().getStore().removeAll();

		// Enable the edit line item button
		me.getLineEditBtn().enable();

		// Set the default remit advice for the vendor
		form.findField('remit_advice').setValue(vendor.get('remit_req'));
		
		if (invoice_id !== null) {
			me.buildViewToolbar(formData);
		}

		Ext.resumeLayouts(true);
	},

	getVendorRecord: function() {
		var me          = this,
			vendorField = me.getInvoiceVendorCombo();

		if (vendorField.getValue() !== null) {
			return vendorField.findRecordByValue(vendorField.getValue());
		}

		return null;
	},

	setVendorDisplay: function() {
		var me            = this,
			vendorDisplay = Ext.ComponentQuery.query('#vendorDisplay')[0],
			vendorField   = me.getInvoiceVendorCombo();

		me.selectedVendor = vendorField.getValue();

		if (vendorField.getValue() !== null) {
			var vendor = me.getVendorRecord();
			me.selectedVendor = vendor;

			vendorDisplay.update(
				'<b>' + vendor.get('vendor_name') + 
				' (' + vendor.get('vendor_id_alt') + ')</b>' +
				vendor.getAddressHtml() +
				'<div>' + vendor.getFullPhone() + '</div>'
			);

			vendorDisplay.show();
		} else {
			vendorDisplay.hide();
		}
	},

	checkLock: function(callback) {
		var me         = this,
			invoice    = me.getInvoiceRecord(),
			invoice_id = invoice.get('invoice_id');

		// If dealing with a new invoice, there's no lock needed, just proceed
		if (invoice_id === null) {
			callback();
		// Otherwise, check the lock and only proceed if it matches
		} else {
			NP.lib.core.Net.remoteCall({
				requests: {
					service   : 'InvoiceService',
					action    : 'getLock',
					invoice_id: invoice_id,
					success   : function(lock_id) {
						// The lock_id matches, proceed
						if (lock_id === invoice.get('lock_id')) {
							callback();
						// The lock_id doesn't match, give the user some options
						} else {
							// TODO:
						}
					}
				}
			});
		}
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
	},

	onDeleteLineClick: function(invoiceitem_id) {
		var me        = this,
			lineStore = me.getLineView().getStore()
			lineRec   = lineStore.getById(invoiceitem_id);

		lineStore.remove(lineRec);
	},

	onSplitLineClick: function(invoiceitem_id) {
		var me              = this,
			lineStore       = me.getLineDataView().getStore(),
			lineRec         = lineStore.getById(invoiceitem_id),
			vendorsite_id   = me.getVendorRecord().get('vendorsite_id'),
			win             = Ext.create('NP.view.shared.invoicepo.SplitWindow', {
								type: 'invoice'
							});

		win.show(null, function() {
			var splitComboStore = me.getSplitCombo().getStore(),
				splitStore      = me.getSplitGrid().getStore();

			splitComboStore.addExtraParams({
				userprofile_id             : NP.Security.getUser().get('userprofile_id'),
				delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
				vendorsite_id              : vendorsite_id
			});
			splitComboStore.load();

			splitStore.on('add', me.calculateAllocation, me);
			splitStore.on('remove', me.calculateAllocation, me);
			splitStore.on('update', function(store, rec, operation) {
				if (operation != Ext.data.Model.COMMIT) {
					me.calculateAllocation();
				}
			}, me);

			me.openSplitLineRec = lineRec;
			me.isNewSplit       = (lineRec.get('invoiceitem_split') !== 1);

			win.down('#splitDescription').setValue(lineRec.get('invoiceitem_description'));
			win.down('#splitUnitPrice').setValue(lineRec.get('invoiceitem_unitprice'));

			if (me.isNewSplit) {
				win.down('#splitTotalQty').setValue(lineRec.get('invoiceitem_quantity'));

				var newRec = lineRec.copy();
				newRec.set('split_percentage', 100);
				splitStore.add(newRec);
			} else {
				var splitRecs = me.getSplitLines(me.openSplitLineRec),
					totalQty  = 0;

				splitRecs.each(function(splitRec) {
					totalQty += splitRec.get('invoiceitem_quantity');
				});

				win.down('#splitTotalQty').setValue(totalQty);

				splitRecs.each(function(splitRec) {
					splitStore.add(splitRec.copy());
				});
			}
		});
	},

	getSplitLines: function(rec) {
		var me         = this,
			lineStore  = me.getLineGrid().getStore(),
			desc       = rec.get('invoiceitem_description'),
			unitPrice  = rec.get('invoiceitem_unitprice'),
			recs;

		recs = lineStore.queryBy(function(lineRec, id) {
			if (
				lineRec.get('invoiceitem_description') == desc
				&& lineRec.get('invoiceitem_unitprice') == unitPrice
				&& lineRec.get('invoiceitem_split') == 1
			) {
				return true;
			}
		}, me);

		return recs;
	},

	onSelectSplit: function(combo, recs) {
		var me        = this,
			grid      = me.getSplitGrid(),
			store     = grid.getStore(),
			totalRecs = store.getCount(),
			maxIndex  = totalRecs - 1,
			newRec,
			i;

		// Retrieve the items for the selected split
		NP.lib.core.Net.remoteCall({
			requests: {
				service   : 'SplitService',
				action    : 'getSplitItems',
				dfsplit_id: recs[0].get('dfsplit_id'),
				success   : function(items) {
					Ext.suspendLayouts();

					// Look through the items for the selected split
					for (i=0; i<items.length; i++) {
						// If we're on a row that has a record already, just reuse it
						if (maxIndex >= i) {
							newRec = store.getAt(i);
						// Otherwise, create a new record based on the original line
						} else {
							newRec = me.openSplitLineRec.copy();
						}
						
						// Update the line record with the split line values
						newRec.set(items[i]);
						newRec.set('dfsplit_name', recs[0].get('dfsplit_name'));
						newRec.set('split_percentage', items[i]['dfsplititem_percent']);
						me.calculateAmountFromPercentage(items[i]['dfsplititem_percent'], newRec);

						// If the record is for a new line, add it to the store
						if (maxIndex < i) {
							store.add(newRec);
						}
					}

					// If the old split configuration had more lines the new one, remove the extra lines
					if (items.length < totalRecs) {
						for (i=items.length; i<totalRecs; i++) {
							store.removeAt(i);
						}
					}

					Ext.resumeLayouts(true);
				}
			}
		});
	},

	getTotalSplitQty: function() {
		return Ext.ComponentQuery.query('#splitTotalQty')[0].getValue();
	},

	getSplitUnitPrice: function() {
		return Ext.ComponentQuery.query('#splitUnitPrice')[0].getValue();
	},

	getTotalSplitAmount: function() {
		return this.getTotalSplitQty() * this.getSplitUnitPrice();
	},

	onChangeSplitPercentage: function(grid, field) {
		this.calculateAmountFromPercentage(field.getValue(), grid.selectedRec);
	},

	calculateAmountFromPercentage: function(pct, rec) {
		var me        = this,
			qty       = me.getTotalSplitQty(),
			unitPrice = me.getSplitUnitPrice(),
			splitQty  = qty * (pct / 100),
			newAmount = splitQty * unitPrice,
			store     = me.getSplitGrid().getStore();

		rec.set({
			invoiceitem_unitprice: unitPrice,
			invoiceitem_quantity : splitQty,
			invoiceitem_amount   : newAmount
		});

		store.each(function(rec) {
			if (rec.get('split_balance') === 0) {
				rec.set('split_balance', 1);
			} else {
				rec.set('split_balance', 0);
			}
		});
	},

	onChangeSplitAmount: function(grid, field) {
		var me        = this,
			qty       = me.getTotalSplitQty(),
			unitPrice = me.getSplitUnitPrice(),
			amount    = field.getValue(),
			splitPct  = (amount / (unitPrice * qty)),
			splitQty  = splitPct * qty;

		splitPct *= 100;
		
		grid.selectedRec.set({
			split_percentage    : splitPct,
			invoiceitem_quantity: splitQty
		});

		grid.getStore().each(function(rec) {
			rec.set('split_balance', 0);
		});
	},

	onAddSplitLine: function() {
		var me = this,
			rec = me.openSplitLineRec.copy();

		rec.set('invoiceitem_id', null);

		me.getSplitGrid().getStore().add(rec);
	},

	calculateAllocation: function() {
		var me   = this,
			grid = me.getSplitGrid();

		if (grid) {
			var store           = grid.getStore(),
				totalRecs       = store.getCount(),
				totalAmount     = me.getTotalSplitAmount(),
				amountAllocated = 0,
				pctAllocated    = 0,
				rec;

			for (var i=0; i<totalRecs; i++) {
				rec = store.getAt(i);
				amountAllocated += rec.get('invoiceitem_amount');
				pctAllocated += rec.get('split_percentage');
			}

			Ext.ComponentQuery.query('#allocation_amount_left')[0].setValue(totalAmount - amountAllocated);
			Ext.ComponentQuery.query('#allocation_pct_left')[0].setValue(100 - pctAllocated);
		}
	},

	onRecalculateSplit: function() {
		var me        = this,
			store     = me.getSplitGrid().getStore(),
			totalRecs = store.getCount(),
			rec,
			i;

		for (i=0; i<totalRecs; i++) {
			rec = store.getAt(i);
			me.calculateAmountFromPercentage(rec.get('split_percentage'), rec);
		}
	},

	onSaveSplit: function() {
		var me           = this,
			splitStore   = me.getSplitGrid().getStore(),
			totalRecs    = splitStore.getCount(),
			lineDataView = me.getLineDataView(),
			lineStore    = me.getLineGrid().getStore(),
			desc         = Ext.ComponentQuery.query('#splitDescription')[0].getValue(),
			rec,
			i;

		Ext.suspendLayouts();

		if (me.isNewSplit) {
			lineStore.remove(me.openSplitLineRec);
		} else {
			var oldRecs = me.getSplitLines(me.openSplitLineRec);

			oldRecs.each(function(lineRec) {
				lineStore.remove(lineRec);
			});
		}

		
		me.openSplitLineRec = null;

		for (i=0; i<totalRecs; i++) {
			rec = splitStore.getAt(i);
			rec.set('invoiceitem_description', desc);
			rec.set('invoiceitem_split', 1);
			lineStore.add(rec);
		}

		lineDataView.refresh();

		Ext.resumeLayouts(true);

		me.getSplitWindow().close();
	},

	onShowVoidInvoice: function() {
		var win = Ext.widget('invoice.voidwindow');
		win.show();
	},

	onCancelVoidInvoice: function() {
		var me  = this,
			win = me.getCmp('invoice.voidwindow');

		win.close();
	},

	onSaveVoidInvoice: function() {
		var me        = this,
			win       = me.getCmp('invoice.voidwindow'),
			noteField = win.down('[name="note"]'),
			invoice_id;

		if (noteField.isValid()) {
			invoice_id = me.getInvoiceRecord().get('invoice_id');

			NP.lib.core.Net.remoteCall({
				method  : 'POST',
				requests: {
					service   : 'InvoiceService',
					action    : 'void',
					invoice_id: invoice_id,
					note      : noteField.getValue(),
					success   : function(result) {
						if (!result.success) {
							Ext.MessageBox.alert(
								NP.Translator.translate('Error'),
								NP.Translator.translate('An unexpected error occurred. Please try again.')
							);
						} else {
							NP.Util.showFadingWindow({
								html: NP.Translator.translate('The invoice has been voided')
							});

							Ext.suspendLayouts();

							me.showView(invoice_id);

							Ext.resumeLayouts(true);

							win.close();
						}
					}
				}
			});
		}
	},

	isInvoiceReadOnly: function() {
		var me      = this,
			invoice = me.getInvoiceRecord();

		if ( Ext.Array.contains(['hold','void'], invoice.get('invoice_status')) ) {
			return true;
		}

		return false;
	},

	makeInvoiceReadOnly: function() {
		var me     = this,
			form   = me.getInvoiceView(),
			fields = form.getForm().getFields(),
			field,
			i;

		Ext.suspendLayouts();

		// Loop through all the form fields and make them read-only
		for (i=0; i<fields.getCount(); i++) {
			field = fields.getAt(i);
			if (field.setReadOnly) {
				field.setReadOnly(true);
			}
		}

		// Disable the edit line button
		me.getLineEditBtn().disable();

		Ext.resumeLayouts(true);
	},

	onShowOnHoldInvoice: function() {
		var win = Ext.widget('invoice.holdwindow');
		win.show();
	},

	onCancelOnHoldInvoice: function() {
		var me  = this,
			win = me.getCmp('invoice.holdwindow');

		win.close();
	},

	onSaveOnHoldInvoice: function() {
		var me          = this,
			win         = me.getCmp('invoice.holdwindow'),
			form        = win.down('form'),
			reasonField = win.down('[name="reason_id"]'),
			noteField   = win.down('[name="note"]'),
			invoice_id;

		if (form.isValid()) {
			invoice_id = me.getInvoiceRecord().get('invoice_id');

			NP.lib.core.Net.remoteCall({
				method  : 'POST',
				requests: {
					service   : 'InvoiceService',
					action    : 'placeOnHold',
					invoice_id: invoice_id,
					reason_id : reasonField.getValue(),
					note      : noteField.getValue(),
					success   : function(result) {
						if (!result.success) {
							Ext.MessageBox.alert(
								NP.Translator.translate('Error'),
								NP.Translator.translate('An unexpected error occurred. Please try again.')
							);
						} else {
							NP.Util.showFadingWindow({
								html: NP.Translator.translate('The invoice has been placed on hold')
							});

							Ext.suspendLayouts();

							me.showView(invoice_id);

							Ext.resumeLayouts(true);

							win.close();
						}
					}
				}
			});
		}
	},

	onActivateInvoice: function() {
		var me          = this,
			dialogTitle = NP.Translator.translate('Activate Invoice?'),
			dialogText  = NP.Translator.translate('Are you sure you want to activate the Invoice?');

		Ext.MessageBox.confirm(dialogTitle, dialogText, function(btn) {
			// If user clicks Yes, proceed with deleting
			if (btn == 'yes') {
				var invoice_id = me.getInvoiceRecord().get('invoice_id');

				// Ajax request to delete catalog
				NP.Net.remoteCall({
					requests: {
						service   : 'InvoiceService',
						action    : 'activate',
						invoice_id: invoice_id,
						success   : function(result) {
							if (!result.success) {
								Ext.MessageBox.alert(
									NP.Translator.translate('Error'),
									NP.Translator.translate('An unexpected error occurred. Please try again.')
								);
							} else {
								NP.Util.showFadingWindow({
									html: NP.Translator.translate('The invoice has been activated')
								});

								me.showView(invoice_id);
							}
						}
					}
				});
			}
		});
	},

	onSaveInvoice: function() {
		var me      = this,
			form    = me.getInvoiceView(),
			invoice = me.getInvoiceRecord();

		// Check if form is valid
		if (form.isValid()) {
			// Form is valid so submit it using the bound model
			form.submitWithBindings({
				service: 'InvoiceService',
				action : 'saveInvoice',
				extraParams: {
					
				},
				extraFields: {
					vendor_id: 'vendor_id'
				},
				success: function(result) {
					// Show info message
					NP.Util.showFadingWindow({ html: 'Invoice saved successfully' });

					if (invoice.get('invoice_id') === null) {
						me.addHistory('Invoice:showView:' + result['invoice_id']);
					} else {
						me.showView(invoice_id);
					}
				}
			});
		}
	}
});