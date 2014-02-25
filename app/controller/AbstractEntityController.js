/**
 * The AbstractEntityController controller is an abstract controller that covers overlapping functionality
 * for invocies, POs, and receipts (mostly the first two)
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.AbstractEntityController', {
	extend: 'NP.lib.core.AbstractController',
	
	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security',
		'NP.lib.core.Net',
		'NP.lib.core.Translator',
		'NP.lib.core.Util',
		'NP.lib.ui.Uploader',
		'NP.lib.core.KeyManager'
	],
	
	refs: [
		{ ref: 'invoiceView', selector: '[xtype="' + me.shortName + '.view"]' },
		{ ref: 'invoiceViewToolbar', selector: '[xtype="' + me.shortName + '.viewtoolbar"]' },
		{ ref: 'invoicePropertyCombo', selector: '#invoicePropertyCombo' },
		{ ref: 'invoiceVendorCombo', selector: '#invoiceVendorCombo' },
		{ ref: 'lineMainView', selector: '[xtype="shared.invoicepo.viewlineitems"]' },
		{ ref: 'lineView', selector: '[xtype="shared.invoicepo.viewlines"]' },
		{ ref: 'lineDataView', selector: '[xtype="shared.invoicepo.viewlines"] dataview' },
		{ ref: 'taxField', selector: '#entity_tax_amount' },
		{ ref: 'shippingField', selector: '#entity_shipping_amount' },
		{ ref: 'lineGrid', selector: '[xtype="shared.invoicepo.viewlinegrid"]' },
		{ ref: 'forwardsGrid', selector: '[xtype="shared.invoicepo.forwardsgrid"]' },
		{ ref: 'historyLogGrid', selector: '[xtype="shared.invoicepo.historyloggrid"]' },
		{ ref: 'warningsView', selector: '[xtype="shared.invoicepo.viewwarnings"] dataview' },
		{ ref: 'lineGridPropertyCombo',selector: '#lineGridPropertyCombo' },
		{ ref: 'lineGridGlCombo', selector: '#lineGridGlCombo' },
		{ ref: 'lineGridUnitCombo', selector: '#lineGridUnitCombo' },
		{ ref: 'lineEditBtn', selector: '#invoiceLineEditBtn' },
		{ ref: 'splitWindow', selector: '[xtype="shared.invoicepo.splitwindow"]' },
		{ ref: 'splitGrid', selector: '[xtype="shared.invoicepo.splitwindow"] customgrid' },
		{ ref: 'splitCombo', selector: '#splitCombo'},
		{ ref: 'paymentFormGrid', selector: '[xtype="invoice.paymentwindow"] customgrid' }
	],

	showInvoiceImage: true,

	/* YOU MUST OVERRIDE THESE VALUES WHEN IMPLEMENTING THE OBJECT */
	shortName  : null,
	longName   : null,
	displayName: null,

	init: function() {
		Ext.log(me.controller + ' controller initialized');

		var me  = this,
			app = me.application;

		me.longName  = me.longName.toLowerCase();
		me.shortName = me.shortName.toLowerCase();

		me.apply(me, {
			pk        : me.longName + '_id',
			itemPk    : me.shortName + 'item_id',
			controller: Ext.util.Format.capitalize(me.shortName),
			service   : controller + 'Service'
		});

		// Setup event handlers
		me.control({
			// Clicking on a Register tab
			'[xtype="' + me.shortName + '.register"]': {
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					var activeTab = newCard.getItemId().replace(me.shortName + '_grid_', '').toLowerCase();
					me.addHistory(me.controller + ':showRegister:' + activeTab);
				}
			},
			
			// Clicking on an invoice in a Register grid
			'[xtype="invoice.register"] > grid': {
				itemclick: function(gridView, record, item, index, e, eOpts) {
					me.addHistory( me.controller + ':showView:' + record.get(me.pk) );
				}
			},

			// Clicking on the New Entity button
			'#new' + me.controller + 'Btn,#new' + me.controller + 'MenuBtn': {
				click: function() {
					me.addHistory(me.controller + ':showView');
				}
			},
			
			// Clicking on cancel button on the invoice view page
			'[xtype="' + me.shortName + '.viewtoolbar"] [xtype="shared.button.cancel"]': {
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

			'[xtype="' + me.shortName + '.view"]': {
				destroy: me.onInvoiceViewDestroy
			},

			'[xtype="' + me.shortName + '.view"] [xtype="shared.invoicepo.viewlinegrid"]': {
				beforeedit          : me.onBeforeInvoiceLineGridEdit.bind(me),
				edit                : me.onAfterInvoiceLineGridEdit.bind(me),
				changequantity      : me.onChangeQuantity.bind(me),
				changeunitprice     : me.onChangeUnitPrice.bind(me),
				changeamount        : me.onChangeAmount.bind(me)
			},

			'[xtype="' + me.shortName + '.view"] [xtype="shared.invoicepo.viewlines"]': {
				changetaxtotal      : me.onChangeTaxTotal.bind(me),
				changeshippingtotal : me.onChangeShippingTotal.bind(me)
			},

			'[xtype="' + me.shortName + '.view"] [xtype="shared.invoicepo.viewlineitems"]': {
				lineadd   : me.onStoreAddLine,
				lineupdate: me.onStoreUpdateLine,
				lineremove: me.onStoreRemoveLine
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
				click: me.onLineEditClick.bind(me, true)
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

			// Cancel button on the Void popup window
			'#invoiceVoidCancelBtn': {
				click: me.onCancelVoidInvoice.bind(me)
			},

			// Save button on the Void popup window
			'#invoiceVoidSaveBtn': {
				click: me.onSaveVoidInvoice.bind(me)
			},

			// Button to show the void popup
			'#invoiceOnHoldBtn': {
				click: me.onShowOnHoldInvoice.bind(me)
			},

			// Cancel button on On Hold popup window
			'#invoiceOnHoldCancelBtn': {
				click: me.onCancelOnHoldInvoice.bind(me)
			},

			// Save button on the On Hold popup window
			'#invoiceOnHoldSaveBtn': {
				click: me.onSaveOnHoldInvoice.bind(me)
			},

			// Activate invoice button
			'#activateBtn': {
				click: me.onActivateInvoice.bind(me)
			},

			// Save invoice button
			'#invoiceSaveBtn': {
				click: function() {
					me.onSaveInvoice();
				}
			},

			// Delete invoice button
			'#invoiceDeleteBtn': {
				click: me.onDeleteInvoice
			},

			// View Image button
			'#invoiceImageViewBtn': {
				click: me.onViewImage
			},

			// Manage Images button
			'#invoiceImageManageBtn': {
				click: me.onManageImages
			},

			// Delete button on the Manage Images window
			'#invoiceManageImageWin [xtype="shared.button.delete"]': {
				click: me.onDeleteImage
			},

			// Make primary button on the Manage Images window
			'#invoiceManageImageWin': {
				makeprimary: me.onMakePrimary
			},

			// Add Images button
			'#invoiceImageAddBtn': {
				click: me.onAddImage
			},

			// Delete button on the Manage Images window
			'#invoiceAddImageWin [xtype="shared.button.save"]': {
				click: me.onAddImageSave
			},

			'#invoiceImageUploadBtn': {
				click: me.onUploadImage
			},

			'#invoiceApplyTemplateBtn': {
				click: me.onApplyTemplate
			},

			'#invoiceApplyTemplateWin': {
				usetemplate: me.onApplyTemplateSave
			},

			'#invoiceModifyBtn': {
				click: me.onModifyInvoice
			},

			'#invoiceRejectBtn': {
				click: me.onReject
			},

			'#invoicePostRejectBtn': {
				click: me.onReject
			},

			'#invoiceRejectSaveBtn': {
				click: me.onRejectSave
			},

			'#invoiceRevertBtn': {
				click: me.onRevert
			}
		});

		me.setKeyboardShortcuts();
	},
	
	setKeyboardShortcuts: function() {
		var me             = this,
			editCondition  = function() {
				var activeItem = me.getLineMainView().getLayout().getActiveItem();
				if (Ext.getClassName(activeItem) == 'NP.view.shared.invoicepo.ViewLineGrid') {
					return true;
				}
				return false;
			};

		NP.Keys.addShortcut(me.controller + ':showView:\\d+', [
			// Shortcut for clicking the Edit button on line item panel
			{
				title : 'Edit Lines',
				key   : Ext.EventObject.E,
				fn    : me.onLineEditClick,
				scope : me,
				argsFn: function () { return [true]; }
			},
			// Shortcut for clicking the Add button on line item grid
			{
				title : 'Add Line',
				key   : Ext.EventObject.A,
				fn    : function() {
					me.onLineEditClick(false);
					me.onLineAddClick();
				},
				scope : me
			},
			// Shortcut for going to the next line item in the grid
			{
				title      : 'Next Line',
				key        : Ext.EventObject.RIGHT,
				useAlt     : true,
				fn         : me.selectNextLineItem,
				scope      : me,
				conditionFn: editCondition.bind(me)
			},
			// Shortcut for going to the previous line item in the grid
			{
				title      : 'Previous Line',
				key        : Ext.EventObject.LEFT,
				useAlt     : true,
				fn         : me.selectPreviousLineItem,
				scope      : me,
				conditionFn: editCondition.bind(me)
			},
			// Shortcut for saving line changes
			{
				title      : 'Done With Lines',
				key        : Ext.EventObject.U,
				useAlt     : true,
				fn         : me.onLineSaveClick,
				scope      : me,
				conditionFn: editCondition.bind(me)
			},
			// Shortcut for saving invoice
			{
				title: 'Save Invoice',
				key  : Ext.EventObject.U,
				fn   : function() { me.onSaveInvoice(); },
				scope: me
			}
		]);
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

		me.selectedVendor = null;

		if (invoice_id) {
			Ext.apply(viewCfg.bind, {
				service    : me.service,
				action     : 'get',
				extraParams: { invoice_id: invoice_id },
				extraFields: ['associated_pos']
			});

			Ext.apply(viewCfg, {
				listeners      : {
					dataloaded: function(boundForm, data) {
						Ext.suspendLayouts();

						// Check if the invoice needs to be made readonly
						me.setInvoiceReadOnly(me.isInvoiceReadOnly());
						
						// Set the title
						me.setInvoiceViewTitle();

						// Build the toolbar
						me.buildViewToolbar(data);
						
						// Show warnings if any
						var warnings = data['warnings'];
						if (warnings.length) {
							me.getWarningsView().getStore().add(warnings);
							me.getWarningsView().up('panel').show();
						}

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
						if (me.getSetting('CP.INVOICE_PAY_BY_FIELD', '0') == '1') {
							var payByField = boundForm.findField('invoicepayment_type_id');
							if (payByField.getValue() === null || payByField.getValue() === 0) {
								me.setDefaultPayBy();
							}
						}

						// Initiate some stores that depend on an invoice_id
						Ext.each(['HistoryLogGrid','ForwardsGrid'], function(viewName) {
							var store = me['get'+viewName]().getStore();
							store.addExtraParams({ invoice_id: invoice_id });
							store.load();
						});

						// Load image if needed
						me.loadImage();

						Ext.resumeLayouts(true);

						// Save to recent records
						me.application.getController('Favorites').saveToRecentRecord('Invoice - ' + data['invoice_ref']);
					}
				}
			});
		}

		var form = me.setView('NP.view.invoice.View', viewCfg, null, true);

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
					me.hasPermission(1032) 
					|| me.hasPermission(6076) 
					|| me.hasPermission(6077)
				)
			)
			|| (
				invoice_status == 'saved' 
				&& me.hasPermission(1068) 
				&& me.getSetting('PN.InvoiceOptions.SkipSave') == '0'
			)
		) {
			field.enable();
		} else {
			field.disable();
		}		
	},

	onLineEditClick: function(setFocus) {
		var me       = this,
			grid     = me.getLineGrid(),
			store    = grid.getStore(),
			setFocus = setFocus || false;

		this.getLineMainView().getLayout().setActiveItem(1);

		if (store.getCount() && setFocus) {
			Ext.defer(function() {
				grid.getPlugin('cellediting').startEditByPosition({ row: 0, column: 1 });
			}, 50);
		}
	},

	selectNextLineItem: function() {
		this.selectSequenceLineItem('next');
	},

	selectPreviousLineItem: function() {
		this.selectSequenceLineItem('previous');
	},

	selectSequenceLineItem: function(dir) {
		var me        = this,
			grid      = me.getLineGrid(),
			store     = grid.getStore(),
			increment = (dir == 'previous') ? -1 : 1;;

		if (store.getCount() > 0) {
			var selModel  = grid.getSelectionModel(),
				pos       = selModel.getCurrentPosition();

			if (!pos || store.getCount() == 1) {
				grid.getPlugin('cellediting').startEditByPosition({ row: 0, column: 1 });
			} else {
				var newRow = pos.row + increment;
				if (newRow >= store.getCount()) {
					newRow = 0;
				} else if (newRow < 0) {
					newRow = store.getCount()-1;
				}
				grid.getPlugin('cellediting').startEditByPosition({ row: newRow, column: 1 });
			}
		}
	},

	onLineAddClick: function() {
		var me      = this,
			grid    = me.getLineGrid(),
			store   = grid.getStore(),
			lines   = store.getRange(),
			lineNum = 1,
			propertyRec = me.getPropertyRecord(),
			vendorRec = me.getVendorRecord();
		
		// Since we're sorting by line number, let's figure out the max line number to set
		// the value for the new one
		if (lines.length) {
			lineNum = lines[lines.length-1].get('invoiceitem_linenum') + 1;
		}

		store.add(Ext.create(
			'NP.model.invoice.InvoiceItem',
			{
				// Default property to header property
				property_id    : propertyRec.get('property_id'),
				property_id_alt: propertyRec.get('property_id_alt'),
				property_name  : propertyRec.get('property_name'),
				
				// Default GL Account to vendor default GL account
				glaccount_id    : vendorRec.get('glaccount_id'),
				glaccount_number: vendorRec.get('glaccount_number'),
				glaccount_name  : vendorRec.get('glaccount_name'),

				invoiceitem_linenum: lineNum
			}
		));

		grid.getPlugin('cellediting').startEditByPosition({ row: lines.length, column: 1 });
	},

	onLineSaveClick: function() {
		var me      = this,
			isValid = me.validateLineItems();
		
		if (isValid) {
			me.getLineMainView().getLayout().setActiveItem(0);
		}

		return isValid;
	},

	validateLineItems: function() {
		var me                = this,
			grid              = me.getLineGrid(),
			store             = grid.getStore(),
			count             = store.getCount(),
			reqFields         = ['glaccount_id','property_id'],
			nonZeroFields     = ['invoiceitem_unitprice','invoiceitem_amount','invoiceitem_quantity'],
			jobCostingEnabled = me.getSetting('pn.jobcosting.jobcostingEnabled', '0'),
			useContracts      = me.getSetting('pn.jobcosting.useContracts', '0'),
			useChangeOrders   = me.getSetting('JB_UseChangeOrders', '0'),
			useJobCodes       = me.getSetting('pn.jobcosting.useJobCodes', '0'),
			usePhaseCodes     = me.getSetting('JB_UsePhaseCodes', '0'),
			phaseCodeReq      = me.getSetting('PN.jobcosting.phaseCodeReq', '0'),
			useCostCodes      = me.getSetting('pn.jobcosting.useCostCodes', '0'),
			valid             = true,
			rec,
			cellNode;

		Ext.suspendLayouts();

		// Go through every line to validate it
		for (var i=0; i<count; i++) {
			rec = store.getAt(i);
			for (var j=0; j<grid.columns.length; j++) {
				var error = null,
					col   = grid.columns[j],
					val   = rec.get(col.dataIndex);

				if (Ext.Array.contains(reqFields, col.dataIndex) && val == null) {
					error = 'This field is required';
				} else if (Ext.Array.contains(nonZeroFields, col.dataIndex) && val == 0) {
					error = 'This field cannot be set to zero';
				}

				// Validate job costing fields
				if (jobCostingEnabled == '1') {
					// If a job code was entered, check some more fields
					if (rec.get('jbjobcode_id') !== null) {
						// Phase code needs to be picked if phase codes are enabled and a job code was picked
						if (usePhaseCodes == '1' && phaseCodeReq == '1' && col.dataIndex == 'jbphasecode_id' && val == null) {
							error = 'This field is required';
						}
						
						if (useCostCodes == '1' && col.dataIndex == 'jbcostcode_id' && val == null) {
							error = 'This field is required';
						}
					} else if (useContracts && rec.get('jbcontract_id') !== null) {
						if (col.dataIndex == 'jbjobcode_id' && val == null) {
							error = 'This field is required';
						}
					}
				}

				if (error != null) {
					me.getLineMainView().getLayout().setActiveItem(1);

					cellNode = grid.getView().getCell(rec, col);
					cellNode.addCls('grid-invalid-cell');
					cellNode.set({
						'data-qtip': me.translate(error)
					});
					valid = false;
				}
			}
		}

		Ext.resumeLayouts(true);

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

		if (field && field.getStore && field.queryMode == 'remote') {
			// Delete the last query on the combo, otherwise we get weird cases where
			// the field is blank and the combo still doesn't pull any records
			delete field.lastQuery;

			field.getStore().removeAll();

			field.on('select', function(combo, recs) {
				// Only run this if a record was selected
				if (recs.length) {
					var fields = recs[0].raw;

					// There are certain fields we don't want to overwrite; for example
					// job code has a default glaccount_id field, but we don't want to
					// overwrite the gl account using it, so we remove it from data
					if ('glaccount_id' in fields && field.valueField != 'glaccount_id') {
						delete fields['glaccount_id'];
					}

					// Same applies to property_id
					if ('property_id' in fields && field.valueField != 'property_id') {
						delete fields['property_id'];
					}

					grid.selectedRec.set(fields);
				}
			}, me);
		}

		if (grid.selectedRec.get(e.field) === null) {
			if (field && field.setValue) {
				field.setValue(null);
			}

			if (field && field.setRawValue) {
				field.setRawValue('');
			}
		}

		if (e.field == 'invoiceitem_quantity' || e.field == 'invoiceitem_unitprice' 
				|| e.field == 'invoiceitem_amount' || e.field == 'invoiceitem_description') {
			me.onOpenInvalidSplitField(editor, e.record, field);
		} else if (e.field == 'property_id') {
			me.onOpenPropertyEditor(editor, e.grid, e.record, field);
		} else if (e.field == 'glaccount_id') {
			me.onOpenGlAccountEditor(editor, e.grid, e.record, field);
		} else if (e.field == 'unit_id') {
			me.onOpenUnitEditor(editor, e.grid, e.record, field);
		} else if (e.field == 'vcitem_number' || e.field == 'vcitem_uom') {
			me.onOpenVcItemEditor(editor, e.record, field);
		} else if (e.field == 'jbcontract_id') {
			me.onOpenContractEditor(editor, e.grid, e.record, field);
		} else if (e.field == 'jbchangeorder_id') {
			me.onOpenChangeOrderEditor(editor, e.grid, e.record, field);
		} else if (e.field == 'jbjobcode_id') {
			me.onOpenJobCodeEditor(editor, e.grid, e.record, field);
		} else if (e.field == 'jbphasecode_id') {
			me.onOpenPhaseCodeEditor(editor, e.grid, e.record, field);
		} else if (e.field == 'jbcostcode_id') {
			me.onOpenCostCodeEditor(editor, e.grid, e.record, field);
		} else if (e.field == 'utilityaccount_id') {
			me.onOpenUtilityAccountEditor(editor, e.record, field);
		} else if (e.field == 'utilitycolumn_usagetype_id') {
			me.onOpenUsageTypeEditor(editor, e.record, field);
		} else if (e.field.substr(0, 15) == 'universal_field') {
			me.onOpenCustomFieldEditor(editor, e.grid, e.record, field);
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
		var me            = this,
			propertyField = me.getInvoicePropertyCombo(),
    		property_id   = propertyField.getValue(),
    		store         = grid.propertyStore,
			integration_package_id;

		if (property_id !== null) {
			integration_package_id = propertyField.findRecordByValue(property_id).get('integration_package_id')
		}

		if (integration_package_id) {
			if (integration_package_id != store.getExtraParam('integration_package_id')) {
	    		store.addExtraParams({ integration_package_id: integration_package_id });
			}
		}

		if (grid.selectedRec.get('property_id') !== null) {
			store.add(grid.selectedRec.getData());
		}
	},

	setGlExtraParams: function(grid, rec) {
		var me    = this,
			store = grid.glStore;

		// Only run this if property/GL association is on
		if (me.getSetting('CP.PROPERTYGLACCOUNT_USE') == '1') {
            var property_id = rec.get('property_id');

            if (property_id !== null) {
            	if (property_id != store.getExtraParam('property_id')) {
            		store.addExtraParams({ property_id: property_id });
                }
            }
        // Otherwise run code for associating with integration package
        } else {
        	var integration_package_id = me.getInvoiceView().getLoadedData().integration_package_id;
        	if (integration_package_id != store.getExtraParam('integration_package_id')) {
        		store.addExtraParams({ integration_package_id: integration_package_id });
    		}
        }
	},

	onOpenGlAccountEditor: function(editor, grid, rec, field) {
		var me    = this,
			store = grid.glStore;

		me.setGlExtraParams(grid, rec);

		if (grid.selectedRec.get('glaccount_id') !== null) {
			store.add(grid.selectedRec.getData());
		}
	},

	onOpenUnitEditor: function(editor, grid, rec, field) {
		var me          = this,
    		combo       = me.getLineGridUnitCombo(),
    		property_id = rec.get('property_id'),
    		store       = grid.unitStore;

    	if (property_id !== null) {
        	if (property_id != store.getExtraParam('property_id')) {
        		store.addExtraParams({ property_id: property_id });
            }
        }

        if (grid.selectedRec.get('unit_id') !== null) {
			store.add(grid.selectedRec.getData());
		}
	},

	onOpenCustomFieldEditor: function(editor, grid, rec, customField) {
		var field = customField.field,
			store,
			fieldNumber,
			glaccount_id,
			extraParams;

		// Check if the custom field is a combo box
		if (field.getStore) {
			// If the custom field is a combo, get the store and clear it
			store = field.getStore();
			
			// Extract the field number
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
					}
				}
			}

			var val = grid.selectedRec.get('universal_field' + fieldNumber);
	        if (!Ext.isEmpty(val)) {
				store.add({ universal_field_data: val });
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

	onOpenContractEditor: function(editor, grid, rec, field) {
		var me            = this,
			store         = field.getStore(),
			vendorsite_id = me.getVendorRecord().get('vendorsite_id'),
			extraParams   = store.getExtraParams();
		
		if (!('vendorsite_id' in extraParams) || extraParams['vendorsite_id'] != vendorsite_id) {
			store.addExtraParams({
				vendorsite_id: vendorsite_id
			});
		}

        if (grid.selectedRec.get('jbcontract_id') !== null) {
			store.add(grid.selectedRec.getData());
		}
	},

	onOpenChangeOrderEditor: function(editor, grid, rec, field) {
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
		if (jbcontract_id !== current_contract_id) {
			// Add the contract ID to the store
			store.addExtraParams({
				jbcontract_id: jbcontract_id
			});
		}

        if (grid.selectedRec.get('jbchangeorder_id') !== null) {
			store.add(grid.selectedRec.getData());
		}
	},

	onOpenJobCodeEditor: function(editor, grid, rec, field) {
		var me               = this,
			store            = field.getStore(),
			extraParams      = store.getExtraParams(),
			newExtraParams   = {
				service: 'JobCostingService',
                action : 'getJobCodes'
			};

		// We want to see if extra params have changed to 
		Ext.each(['property_id','jbcontract_id','jbchangeorder_id'], function(field) {
			var val = rec.get(field);
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
		}

        if (grid.selectedRec.get('jbjobcode_id') !== null) {
			store.add(grid.selectedRec.getData());
		}
	},

	onOpenPhaseCodeEditor: function(editor, grid, rec, field) {
		var me               = this,
			store            = field.getStore(),
			extraParams      = store.getExtraParams(),
			newExtraParams   = {
				service: 'JobCostingService',
                action : 'getPhaseCodes'
			};

		// We want to see if extra params have changed to 
		Ext.each(['jbcontract_id','jbchangeorder_id','jbjobcode_id'], function(field) {
			var val = rec.get(field);
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
		}

        if (grid.selectedRec.get('jbphasecode_id') !== null) {
			store.add(grid.selectedRec.getData());
		}
	},

	onOpenCostCodeEditor: function(editor, grid, rec, field) {
		var me               = this,
			store            = field.getStore(),
			extraParams      = store.getExtraParams(),
			newExtraParams   = {
				service: 'JobCostingService',
                action : 'getCostCodes'
			};

		// We want to see if extra params have changed to 
		Ext.each(['jbcontract_id','jbchangeorder_id','jbjobcode_id','jbphasecode_id'], function(field) {
			var val = rec.get(field);
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
		}

        if (grid.selectedRec.get('jbcostcode_id') !== null) {
			store.add(grid.selectedRec.getData());
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
					me.setGlExtraParams(grid, e.record);
					grid.glStore.load(function() {
						// If the current grid value doesn't exist in the store, clear it
						if (grid.glStore.getById(glaccount_id) === null) {
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

	onStoreUpdateLine: function(store, rec, operation, modifiedFieldNames) {
		if (operation == Ext.data.Model.EDIT) {
			var me = this;

            // Set the job costing flag accordingly
            var item_jobflag = ( rec.get('jbjobcode_id') !== null ) ? 1 : 0;
            rec.set('invoiceitem_jobflag', item_jobflag);

            // See if the tax and shipping needs to be recalculated
            var taxUpdated = false;
            for (var i=0; i<modifiedFieldNames.length; i++) {
            	var field = modifiedFieldNames[i];
            	if (field == 'invoiceitem_taxflag') {
            		if (rec.get('invoiceitem_taxflag') == 'N') {
            			rec.set('invoiceitem_salestax', 0);
            		}
            		if (!taxUpdated) {
	            		me.onChangeTaxTotal();
	            		taxUpdated = true;
	            	}
            	} else if (field == 'invoiceitem_amount') {
            		if (!taxUpdated) {
	            		me.onChangeTaxTotal();
	            		taxUpdated = true;
	            	}
	            	me.onChangeShippingTotal();
            	}
            }
        }
	},

	onStoreAddLine: function(store, recs, index) {
		if (this.query('#entity_tax_amount').length) {
        	this.onChangeShippingTotal();
        }
    },

	onStoreRemoveLine: function(store, rec, index, isMove) {
      this.onChangeTaxTotal();
      this.onChangeShippingTotal();  
    },

	onChangeTaxTotal: function() {
		var me           = this,
			tpl          = me.getLineDataView().tpl,
			store        = me.getLineGrid().getStore(),
			recs         = store.query('invoiceitem_taxflag', 'Y'),
			taxableTotal = 0,
			totalTax     = me.getTaxField().getValue();

		recs.each(function(rec) {
			taxableTotal += rec.get('invoiceitem_amount');
		});

		recs.each(function(rec) {
			var amount = rec.get('invoiceitem_amount');
			rec.set('invoiceitem_salestax', (amount / taxableTotal) * totalTax);
		});

		tpl.updateTotals();
	},

	onChangeShippingTotal: function() {
		var me        = this,
			tpl       = me.getLineDataView().tpl,
			store     = me.getLineGrid().getStore(),
			total     = tpl.getSum('invoiceitem_amount'),
			totalShip = me.getShippingField().getValue();

		store.each(function(rec) {
			var amount = rec.get('invoiceitem_amount');
			rec.set('invoiceitem_shipping', (amount / total) * totalShip);
		});

		tpl.updateTotals();
	},

	clearUsageType: function(grid) {
		grid.selectedRec.set('utilitycolumn_usagetype_id', null);
		grid.selectedRec.set('UtilityColumn_UsageType_Name', null);
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

		data = data || { is_approver: false, image: null };
		toolbar.displayConditionData = {};

		Ext.apply(toolbar.displayConditionData, Ext.apply(data, { invoice: invoice }));

		toolbar.refresh();
	},

	getImageRegion: function() {
		var me           = this,
            user         = NP.Security.getUser(),
			isHorizontal = user.get('userprofile_splitscreen_isHorizontal'),
            imageOrder   = user.get('userprofile_splitscreen_ImageOrder'),
            imageRegion  = 'west';

            if (isHorizontal == 1) {
	            imageRegion = (imageOrder == 1) ? 'north' : 'south';
	        } else if (isHorizontal == 0) {
	            imageRegion = (imageOrder == 1) ? 'east' : 'west';
	        }

	        return imageRegion;
	},

	getImagePanel: function() {
		var me = this;

		return Ext.ComponentQuery.query('#' + me.getImageRegion() + 'Panel')[0];
	},

	loadImage: function(showImage) {
		var me           = this,
			data         = me.getInvoiceView().getLoadedData(),
            user         = NP.Security.getUser(),
            hideImg      = user.get('userprofile_splitscreen_LoadWithoutImage'),
            splitSize    = user.get('userprofile_splitscreen_size'),
            imageRegion  = me.getImageRegion(),
            showImage    = showImage || me.showInvoiceImage || false,
            sizeProp,
            imagePanel,
            iframeId,
            iframeEl;

		if (data['image'] !== null) {
			if (Ext.Array.contains(['north','south'], imageRegion)) {
				sizeProp = 'height';
			} else {
				sizeProp = 'width';
			}
	        imagePanel = me.getImagePanel();
	        
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
		    	var src = 'showImage.php?image_index_id=' + data['image']['Image_Index_Id'];
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
		var me            = this,
			form          = me.getInvoiceView(),
			vendorCombo   = me.getInvoiceVendorCombo(),
			periodField   = form.findField('invoice_period'),
			currentPeriod = me.getInvoiceRecord().get('invoice_period');
		
		// Remove all periods from the period store
		periodField.getStore().removeAll();

		if (recs.length) {
			vendorCombo.enable();
			NP.Net.remoteCall({
				requests: {
					service    : 'PropertyService',
					action     : 'getAccountingPeriod',
					property_id: recs[0].get('property_id'),
					success    : function(result) {
						var period = Ext.Date.parse(result['date'], NP.Config.getServerSmallDateFormat());
						me.populatePeriods(period, currentPeriod);
					}
				}
			});
		} else {
			vendorCombo.disable();
		}
	},

	onVendorComboSelect: function(combo, recs) {
		var me          = this,
			invoice_id  = me.getInvoiceRecord().get('invoice_id'),
			vendorField = me.getInvoiceVendorCombo(),
			dialogTitle = me.translate('Change Vendor?'),
			dialogText  = me.translate('Please note, when changing the vendor, all line items and previous approvals will be deleted from this invoice. Are you sure you want to proceed?');

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
									service   : me.service,
									action    : 'changeVendor',
									invoice_id: invoice_id,
									vendor_id : vendorField.getValue(),
									success   : function(result) {
										if (!result.success) {
											me.showUnexpectedError();

											restoreVendor();
										} else {
											NP.Util.showFadingWindow({
												html: me.translate('The vendor has been changed')
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

	showUnexpectedError: function() {
		var me = this;

		Ext.MessageBox.alert(
			me.translate('Error'),
			me.translate('An unexpected error occurred. Please try again.')
		);
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

	getPropertyRecord: function() {
		var me          = this,
			propField   = me.getInvoicePropertyCombo();

		if (propField.getValue() !== null) {
			return propField.findRecordByValue(propField.getValue());
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
			NP.Net.remoteCall({
				requests: {
					service   : me.service,
					action    : 'getLock',
					entity_id : invoice_id,
					success   : function(lock_id) {
						// The lock_id matches, proceed
						if (lock_id === invoice.get('lock_id')) {
							callback();
						// The lock_id doesn't match, give the user some options
						} else {
							Ext.MessageBox.alert(
								me.translate('Invoice Updated'),
								me.translate('The invoice has been updated by another user and is being reloaded')
							);

							me.showView(invoice_id);
						}
					}
				}
			});
		}
	},

	populatePeriods: function(accounting_period, invoice_period) {
		var me               = this,
			periodBack       = parseInt(me.getSetting('CP.INVOICE_POST_DATE_BACK', '0')) * -1,
			periodForward    = parseInt(me.getSetting('CP.INVOICE_POST_DATE_FORWARD', '0')),
			periods          = [],
			periodField      = this.getCmp('invoice.view').findField('invoice_period'),
			accountingPeriod = accounting_period,
			startPeriod,
			endPeriod,
			currentPeriod,
			invoicePeriod;

		if (Ext.isString(accountingPeriod)) {
			accountingPeriod = Ext.Date.parse(accountingPeriod, 'Y-m-d');
		}
		startPeriod = accountingPeriod,
		endPeriod   = accountingPeriod

		if (arguments.length === 1) {
			invoicePeriod = null;
		}

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

		if (invoicePeriod !== null) {
			invoicePeriod = Ext.Date.parse(invoice_period, NP.Config.getServerDateFormat());
			if (invoicePeriod < startPeriod) {
				periods.unshift(invoicePeriod);
			} else if (invoicePeriod > endPeriod) {
				periods.push(invoicePeriod);
			}
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

	onDeleteLineClick: function(lineRec) {
		var me        = this,
			lineStore = me.getLineDataView().getStore();

		lineStore.remove(lineRec);
	},

	onSplitLineClick: function(lineRec) {
		var me              = this,
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
		NP.Net.remoteCall({
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
			lineRec,
			i;

		Ext.suspendLayouts();

		if (me.isNewSplit) {
			rec = splitStore.getById(me.openSplitLineRec.get('invoiceitem_id'));
			if (!rec) {
				lineStore.remove(me.openSplitLineRec);
			}
		} else {
			var oldRecs = me.getSplitLines(me.openSplitLineRec);

			oldRecs.each(function(lineRec) {
				rec = splitStore.getById(lineRec.get('invoiceitem_id'));
				if (!rec) {
					lineStore.remove(lineRec);
				}
			});
		}
		
		me.openSplitLineRec = null;

		for (i=0; i<totalRecs; i++) {
			rec = splitStore.getAt(i);
			lineRec = lineStore.getById(rec.get('invoiceitem_id'));
			if (lineRec) {
				lineRec.set(Ext.apply(rec.getData(), {
					invoiceitem_description: desc,
					invoiceitem_split: 1
				}));
			} else {
				rec.set('invoiceitem_description', desc);
				rec.set('invoiceitem_split', 1);
				lineStore.add(rec);
			}
		}

		lineDataView.refresh();

		Ext.resumeLayouts(true);

		me.getSplitWindow().close();
	},

	isInvoiceReadOnly: function() {
		var me      = this,
			invoice = me.getInvoiceRecord(),
			status  = invoice.get('invoice_status');

		if (
			status == "open"
			|| (
				status ==  "draft" 
				&& (
					me.hasPermission(6076) 
					|| (
						me.hasPermission(6077) 
						&& NP.Security.getUser().get('userprofile_id') == invoice.get('userprofile_id')
					)
				)
			)
			|| (status == "saved" && me.hasPermission(1068))
		) {
			return false;
		}

		return true;
	},

	setInvoiceReadOnly: function(readonly) {
		var me     = this,
			form   = me.getInvoiceView(),
			fields = form.getForm().getFields(),
			fn     = (readonly) ? 'disable' : 'enable',
			field,
			i;

		Ext.suspendLayouts();

		// Loop through all the form fields and make them read-only
		for (i=0; i<fields.getCount(); i++) {
			field = fields.getAt(i);
			if (field.setReadOnly) {
				field.setReadOnly(readonly);
			}
		}

		// Disable the edit line button
		me.getLineEditBtn()[fn]();

		Ext.resumeLayouts(true);
	},

	onSaveInvoice: function(callback) {
		var me      = this,
			invoice = me.getInvoiceRecord();

		// Before saving, make sure invoice hasn't been updated
		me.saveInvoice(
			me.service,
			'saveInvoice',
			{},
			function(result) {
				if (callback) {
					callback(result);
				} else {
					// Show info message
					NP.Util.showFadingWindow({ html: 'Invoice saved successfully' });

					if (invoice.get('invoice_id') === null) {
						me.addHistory('Invoice:showView:' + result['invoice_id']);
					} else {
						me.getInvoiceRecord().set('lock_id', result.lock_id);

						// TODO: need to account for UI changes that may be required on a save
					}
				}
			}
		);
	},

	saveInvoice: function(service, action, extraParams, callback) {
		var me      = this,
			form    = me.getInvoiceView(),
			invoice = me.getInvoiceRecord();

		if (me.onLineSaveClick() && form.isValid()) {
			// Before saving, make sure invoice hasn't been updated
			me.checkLock(function() {
				// Get the line items that need to be saved
				var lineStore    = me.getLineGrid().getStore(),
					modifiedRecs = lineStore.getModifiedRecords(),
					deletedRecs  = lineStore.getRemovedRecords(),
					lines        = NP.Util.convertModelArrayToDataArray(modifiedRecs),
					deletedLines = NP.Util.convertModelArrayToDataArray(deletedRecs),
					tax_amount,
					shipping_amount;

				if (me.query('#entity_tax_amount').length) {
					tax_amount = me.query('#entity_tax_amount', true).getValue();
					shipping_amount = me.query('#entity_shipping_amount', true).getValue();
				} else {
					tax_amount = 0;
					shipping_amount = 0;
				}

				// Form is valid so submit it using the bound model
				form.submitWithBindings({
					service: service,
					action : action,
					extraParams: Ext.apply(extraParams, {
						userprofile_id              : NP.Security.getUser().get('userprofile_id'),
						delegation_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
						lines                       : lines,
						deletedLines                : deletedLines,
						tax                         : tax_amount,
						shipping                    : shipping_amount
					}),
					extraFields: {
						vendor_id: 'vendor_id'
					},
					success: function(result) {
						callback(result);
					}
				});
			});
		}
	},

	onDeleteInvoice: function() {
		var me          = this,
			invoice_id  = me.getInvoiceRecord().get('invoice_id'),
			form        = me.getInvoiceView(),
			data        = form.getLoadedData(),
			dialogTitle = me.translate('Delete Invoice?'),
			dialogText  = me.translate('Are you sure you want to delete this Invoice?');

		if (data['image'] !== null) {
			dialogText += "<br /> You will only be able to view the attached image(s) in the Deleted Images section of Image Management.";
		}

		Ext.MessageBox.confirm(dialogTitle, dialogText, function(btn) {
			// If user clicks Yes, proceed with deleting
			if (btn == 'yes') {
				NP.Net.remoteCall({
					mask    : form,
					method  : 'POST',
					requests: {
						service                     : me.service,
						action                      : 'deleteInvoice',
						// Params
						invoice_id                  : invoice_id,
						// Callback
						success: function(result) {
							if (result.success) {
								NP.Util.showFadingWindow({
									html: me.translate('The invoice has been deleted')
								});

								me.addHistory('Invoice:showRegister');
							} else {
								me.showUnexpectedError();
							}
						}
					}
				});
			}
		});
	},

	onViewImage: function() {
		var me   = this,
			data = me.getInvoiceView().getLoadedData();

		if (data['image'] != null) {
			var url = 'showImage.php?image_index_id=' + data['image']['Image_Index_Id'];

			window.open(
                url,
                '_blank',
                'width=800, height=600, resizable=yes, scrollbars=yes'
            );
		}
	},

	onManageImages: function() {
		var me    = this,
			win   = Ext.widget('shared.invoicepo.imagesmanagewindow', { itemId: 'invoiceManageImageWin', type: 'invoice' }),
			store = win.down('customgrid').getStore();

		store.addExtraParams({
			entity_id: me.getInvoiceRecord().get('invoice_id')
		});
		store.load();

		win.show();
	},

	onDeleteImage: function() {
		var me          = this,
			form        = me.getInvoiceView(),
			win         = me.getCmp('shared.invoicepo.imagesmanagewindow'),
			grid        = win.down('customgrid'),
			recs        = grid.getSelectionModel().getSelection(),
			dialogTitle = me.translate('Delete Images?'),
			dialogText  = me.translate('Are you sure you want to delete the selected images?');

		// Check if any image was selected for deletion
		if (!recs.length) {
			// if no image was selected, show an error
			Ext.MessageBox.alert(
				me.translate('Error'),
				me.translate('You must select at least one image to delete.')
			);
		// If images were selected, provided confirmation box
		} else {
			Ext.MessageBox.confirm(dialogTitle, dialogText, function(btn) {
				// If user clicks Yes, proceed with deleting
				if (btn == 'yes') {
					recs = NP.Util.valueList(recs, 'Image_Index_Id');

					NP.Net.remoteCall({
						method  : 'POST',
						mask    : grid,
						requests: {
							service            : me.service,
							action             : 'removeImages',
							entity_id          : me.getInvoiceRecord().get('invoice_id'),
							image_index_id_list: recs,
							success            : function(result) {
								var data = me.getInvoiceView().getLoadedData();

								NP.Util.showFadingWindow({
									html: me.translate('Images have been deleted')
								});

								// Deal with deletion of all images
								if (grid.getStore().getCount() == recs.length) {
									Ext.suspendLayouts();
									
									data['image'] = null;
									me.getImagePanel().hide();
									me.buildViewToolbar(form.getLoadedData());

									Ext.resumeLayouts(true);
								}
								// Deal with deletion of primary image
								else if (Ext.Array.contains(recs, data['image']['Image_Index_Id'])) {
									if (result['new_primary_image'] !== null) {
										data['image'] = result['new_primary_image'];
										me.loadImage();
									}
								}

								win.close();
							}
						}
					});
				}
			});
		}
	},

	onMakePrimary: function(rowIndex, rec) {
		var me         = this,
			win        = me.getCmp('shared.invoicepo.imagesmanagewindow'),
			grid       = win.down('customgrid'),
			primaryRec = grid.getStore().findRecord('Image_Index_Primary', 1);;

		NP.Net.remoteCall({
			method  : 'POST',
			mask    : grid,
			requests: {
				service       : 'ImageService',
				action        : 'makePrimary',
				// Extra params
				image_index_id: rec.get('Image_Index_Id'),
				
				success       : function(result) {
					primaryRec.set('Image_Index_Primary', 0);
					rec.set('Image_Index_Primary', 1);

					me.getInvoiceView().getLoadedData()['image'] = rec.getData();
					me.loadImage();

					NP.Util.showFadingWindow({
						html: me.translate('Primary image has been changed')
					});
				}
			}
		});
	},

	onAddImage: function() {
		var me    = this,
			win   = Ext.widget('shared.invoicepo.imagesaddwindow', { itemId: 'invoiceAddImageWin', type: 'invoice' }),
			store = win.down('customgrid').getStore();

		store.addExtraParams({
			vendor_id: me.getInvoiceVendorCombo().getValue()
		});
		store.load();

		win.show();
	},

	onAddImageSave: function() {
		var me   = this,
			form = me.getInvoiceView(),
			win  = me.getCmp('shared.invoicepo.imagesaddwindow'),
			grid = win.down('customgrid'),
			recs = grid.getSelectionModel().getSelection();

		if (!recs.length) {
			Ext.MessageBox.alert(
				me.translate('Error'),
				me.translate('You must select at least one image to add.')
			);
		} else {
			recs = NP.Util.valueList(recs, 'Image_Index_Id');

			NP.Net.remoteCall({
				method  : 'POST',
				mask    : grid,
				requests: {
					service            : me.service,
					action             : 'addImages',
					entity_id          : me.getInvoiceRecord().get('invoice_id'),
					image_index_id_list: recs,
					success            : function(result) {
						var data = me.getInvoiceView().getLoadedData();

						NP.Util.showFadingWindow({
							html: me.translate('Images have been added')
						});

						// Deal with deletion of all images
						if (data['image'] === null) {
							data['image'] = result['new_primary_image'];
							me.loadImage();
						}

						win.close();
					}
				}
			});
		}
	},

	onUploadImage: function() {
		var me       = this,
			data     = me.getInvoiceView().getLoadedData(),
			uploader = Ext.create('NP.lib.ui.Uploader', {
	            params: {
	            	files: {
	            		extensions : '*.pdf; *.doc; *.docx; *.ppt; *.pptx; *.xls; *.xlsx; *.jpeg; *.jpg; *.gif; *.tif; *.tiff',
	            		description: 'Image Files'
	            	},
	                form: {
						service  : me.service,
						action   :  'uploadImage',
						entity_id: me.getInvoiceRecord().get('invoice_id')
	                },
	                listeners: {
	                    onUploadComplete: function(file, returnVal) {
	                    	// Process the status for the image upload
	                    	var result = Ext.JSON.decode(returnVal);

	                    	// If individual image upload failed, store file name
	                    	if (!result.success) {
	                    		uploader.errors.push(file.name);
	                    	}
	                    	// Else if there's no image currently attached to invoice
	                    	// and this is the first image uploaded, store the ID so we can use
	                    	// it later to display the invoice when all uploads are done
	                    	else if (data['image'] === null && !uploader.image_index_id) {
	                    		uploader.image_index_id = result['image_index_id'];
	                    	}
	                    },
	                    onQueueComplete: function(uploads) {
	                    	var msg = me.translate('File(s) uploaded');

	                    	// If any file upload failed, display an alert indicating
	                    	// which files failed to upload
	                    	if (uploader.errors.length) {
	                    		msg += '<br /><br />';
	                    		msg += me.translate('The following files could not be uploaded:');
	                    		for (var i=0; i<uploader.errors.length; i++) {
	                    			msg += uploader.errors.join(',');
	                    		}

	                    		Ext.MessageBox.alert(
									me.translate('Error'),
									msg
								);
	                    	}
	                    	// Otherwise just display a message that indicates the upload was successful
	                    	else {
	                    		NP.Util.showFadingWindow({
		                        	html: msg
		                        });
	                    	}

	                    	// If there's a new primary image, make it display
	                    	if (data['image'] === null && uploader.image_index_id) {
	                        	// Update the image reference
	                        	data['image'] = { Image_Index_Id: uploader.image_index_id };
	                        	// Show the image
	                        	me.loadImage();
	                        	// Update the toolbar to make sure the "Manage Images" button shows
	                        	me.buildViewToolbar(data);
	                        }

	                    	uploader.close();
	                    }
	                }
	            }
	        });
		
		uploader.errors = [];
        uploader.show();
	},

	onApplyTemplate: function() {
		var me            = this,
            property_id   = me.getInvoiceView().findField('property_id').getValue(),
            vendorsite_id = me.getVendorRecord().get('vendorsite_id');
        
        if (!vendorsite_id || !property_id) {
            Ext.MessageBox.alert('Use Template', 'You must select a property and vendor.');
            return;
        }

        var win = Ext.create('NP.view.invoice.UseTemplateWindow', {
            itemId               : 'invoiceApplyTemplateWin',
            property_id          : property_id,
            vendorsite_id        : vendorsite_id
        });

        win.show();
	},

    onApplyTemplateSave: function(win, template_id) {
        var me         = this,
        	invoice_id = me.getInvoiceRecord().get('invoice_id');

        me.checkLock(function() {
        	NP.Net.remoteCall({
        		method  : 'POST',
        		mask    : me.getInvoiceView(),
        		requests: {
					service    : me.service,
					action     : 'applyTemplate',
					invoice_id : invoice_id,
					template_id: template_id,
					success    : function(result) {
						if (result.success) {
							// Show notification
							NP.Util.showFadingWindow({
								html: me.translate('The template was successfully applied')
							});

							// Refresh the invoice
							me.showView(invoice_id);

							// Close the apply template window
							win.close();
						} else {
							me.showUnexpectedError();
						}
					}
        		}
        	});
        });
    },

    onModifyInvoice: function() {
    	var me          = this,
			dialogTitle = me.translate('Modify Invoice?'),
			dialogText  = me.translate('Are you sure you want to modify the Invoice?');

    	Ext.MessageBox.confirm(dialogTitle, dialogText, function(btn) {
			// If user clicks Yes, proceed with deleting
			if (btn == 'yes') {
				NP.Net.remoteCall({
	        		method  : 'POST',
	        		mask    : me.getInvoiceView(),
	        		requests: {
						service    : me.service,
						action     : 'modifyInvoice',
						invoice_id : me.getInvoiceRecord().get('invoice_id'),
						success    : function(result) {
							if (result.success) {
								me.getInvoiceRecord().set({
									invoice_status       : 'open',
									invoice_submitteddate: null
								});

								Ext.suspendLayouts();
								
								me.buildViewToolbar(me.getInvoiceView().getLoadedData());
								me.setInvoiceReadOnly(false);
								
								Ext.resumeLayouts(true);
							} else {
								me.showUnexpectedError();
							}
						}
	        		}
	        	});
			}
		});
    },

    onReject: function() {
    	var win = Ext.widget('shared.invoicepo.rejectwindow', {
    		type: 'invoice'
    	});

    	win.show();
    },

    onRejectSave: function() {
    	var me            = this,
    		win           = me.getCmp('shared.invoicepo.rejectwindow'),
    		form          = win.down('form'),
    		invoice_id    = me.getInvoiceRecord().get('invoice_id'),
    		reasonField   = win.down('[name="rejectionnote_id"]'),
			noteField     = win.down('[name="invoice_reject_note"]');

    	if (form.isValid()) {
    		me.checkLock(function() {
	    		NP.Net.remoteCall({
					method  : 'POST',
					mask    : form,
					requests: {
						service            : me.service,
						action             : 'reject',
						invoice_id         : invoice_id,
						rejectionnote_id   : reasonField.getValue(),
						invoice_reject_note: noteField.getValue(),
						success            : function(result) {
							if (result.success) {
								NP.Util.showFadingWindow({
									html: me.translate('The invoice has been rejected')
								});

								Ext.suspendLayouts();

								me.showView(invoice_id);

								Ext.resumeLayouts(true);

								win.close();
							} else {
								me.showUnexpectedError()
							}
						}
					}
				});
			});
    	}
    },

	onRevert: function() {
		var me          = this,
			invoice_id  = me.getInvoiceRecord().get('invoice_id'),
			dialogTitle = 'Revert Invoice?',
			dialogText  = 'You are about to Revert this Invoice as an Open Invoice. Are you sure you want to proceed?';

		Ext.MessageBox.confirm(dialogTitle, dialogText, function(btn) {
			// If user clicks Yes, proceed with reverting
			if (btn == 'yes') {
				NP.Net.remoteCall({
					requests: {
						service   : 'InvoiceService',
						action    : 'revert',
						invoice_id: invoice_id,
						success   : function(result) {
							if (result.success) {
								me.showView(invoice_id);
							} else {
								me.showUnexpectedError();
							}
						}
					}
				});
			}
		});	
	}
});