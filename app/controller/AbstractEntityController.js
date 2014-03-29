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
	
	showEntityImage: true,

	/* YOU MUST OVERRIDE THESE VALUES WHEN IMPLEMENTING THE OBJECT */
	shortName  : null,
	longName   : null,
	displayName: null,

	constructor: function(cfg) {
		var me = this;
		
		me.longName   = me.longName.toLowerCase();
		me.shortName  = me.shortName.toLowerCase();
		me.controller = Ext.util.Format.capitalize(me.shortName);
		me.modelClass = Ext.util.Format.capitalize(me.longName);

		Ext.apply(me, {
			pk        : me.longName + '_id',
			itemPrefix: me.shortName + 'item',
			itemPk    : me.shortName + 'item_id',
			service   : me.controller + 'Service'
		});

		if (!me.refs) {
			me.refs = [];
		}

		me.refs.push(
			{ ref: 'entityView', selector: '[xtype="' + me.shortName + '.view"]' },
			{ ref: 'viewToolbar', selector: '[xtype="' + me.shortName + '.viewtoolbar"]' },
			{ ref: 'propertyCombo', selector: '#entityPropertyCombo' },
			{ ref: 'vendorCombo', selector: '#entityVendorCombo' },
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
			{ ref: 'lineAddBtn', selector: '#' + me.shortName + 'LineViewAddBtn' },
			{ ref: 'lineEditBtn', selector: '#' + me.shortName + 'LineEditBtn' },
			{ ref: 'splitWindow', selector: '[xtype="shared.invoicepo.splitwindow"]' },
			{ ref: 'splitGrid', selector: '[xtype="shared.invoicepo.splitwindow"] customgrid' },
			{ ref: 'splitCombo', selector: '#splitCombo'}
		);

		me.callParent(arguments);
	},

	init: function() {
		var me  = this,
			app = me.application;

		Ext.log(me.controller + ' controller initialized');

		// Setup event handlers
		var control = {};
		
		// Line item view
		control['[xtype="' + me.shortName + '.view"] [xtype="shared.invoicepo.viewlines"]'] = {
			// Clicking the Edit link on a line item
			clickeditline  : me.onEditLineClick.bind(me),
			// Clicking the Split link on a line item
			clicksplitline : me.onSplitLineClick.bind(me),
			clickeditsplit : me.onSplitLineClick.bind(me),
			clickdeleteline: me.onDeleteLineClick.bind(me),
			// Changing Tax or Shipping
			changetaxtotal     : me.onChangeTaxTotal.bind(me),
			changeshippingtotal: me.onChangeShippingTotal.bind(me)
		};

		// Split grid
		control['#' + me.shortName + 'SplitWin customgrid'] = {
			beforeedit      : me.onBeforeLineGridEdit.bind(me),
			changepercentage: me.onChangeSplitPercentage.bind(me),
			changeamount    : me.onChangeSplitAmount.bind(me)
		};

		// Split combo box in the split window
		control['#' + me.shortName + 'SplitWin #splitCombo'] = {
			select: me.onSelectSplit.bind(me)
		};

		// Button to add a split line
		control['#' + me.shortName + 'SplitWin #splitLineAddBtn'] = {
			click: me.onAddSplitLine.bind(me)
		};

		// Button to recalculate split amounts
		control['#' + me.shortName + 'SplitWin #recalculateBtn'] = {
			click: me.onRecalculateSplit.bind(me)
		};

		// Button to save split
		control['#' + me.shortName + 'SplitWin #saveSplitBtn'] = {
			click: me.onSaveSplit.bind(me)
		};

		// Save invoice button
		control['#' + me.shortName + 'SaveBtn'] = {
			click: function() {
				me.onSaveInvoice();
			}
		};

		// Delete invoice button
		control['#' + me.shortName + 'DeleteBtn'] = {
			click: me.onDeleteInvoice
		};

		// View Image button
		control['#' + me.shortName + 'ImageViewBtn'] = {
			click: me.onViewImage
		};

		// Manage Images button
		control['#' + me.shortName + 'ImageManageBtn'] = {
			click: me.onManageImages
		};

		// Delete button on the Manage Images window
		control['#' + me.shortName + 'ManageImageWin [xtype="shared.button.delete"]'] = {
			click: me.onDeleteImage
		};

		// Make primary button on the Manage Images window
		control['#' + me.shortName + 'ManageImageWin'] = {
			makeprimary: me.onMakePrimary
		};

		// Add Images button
		control['#' + me.shortName + 'ImageAddBtn'] = {
			click: me.onAddImage
		};

		// Delete button on the Manage Images window
		control['#' + me.shortName + 'AddImageWin [xtype="shared.button.save"]'] = {
			click: me.onAddImageSave
		};

		control['#' + me.shortName + 'ImageUploadBtn'] = {
			click: me.onUploadImage
		};

		control['#' + me.shortName + 'ApplyTemplateBtn'] = {
			click: me.onApplyTemplate
		};

		control['#' + me.shortName + 'ApplyTemplateWin'] = {
			usetemplate: me.onApplyTemplateSave
		};

		control['#' + me.shortName + 'ModifyBtn'] = {
			click: me.onModifyInvoice
		};

		control['#' + me.shortName + 'RejectBtn'] = {
			click: me.onReject
		};

		control['#' + me.shortName + 'PostRejectBtn'] = {
			click: me.onReject
		};

		control['#' + me.shortName + 'RejectSaveBtn'] = {
			click: me.onRejectSave
		};

		// Clicking on a Register tab
		control['[xtype="' + me.shortName + '.register"]'] = {
			tabchange: function(tabPanel, newCard, oldCard, eOpts) {
				var activeTab = newCard.getItemId().replace(me.shortName + '_grid_', '').toLowerCase();
				me.addHistory(me.controller + ':showRegister:' + activeTab);
			}
		};

		// Clicking on an entity in a Register grid
		control['[xtype="' + me.shortName + '.register"] > grid'] = {
			itemclick: function(gridView, record, item, index, e, eOpts) {
				me.addHistory( me.controller + ':showView:' + record.get(me.pk) );
			}
		};

		// Making a change to the context picker (picking from drop-down or clicking radio button)
		control['#'+me.shortName+'RegisterContextPicker'] = {
			change: function(toolbar, filterType, selected) {
				var contentView = app.getCurrentView();
				// If user picks a different property/region and we're on a register, update the grid
				if (contentView.getXType() == me.shortName + '.register') {
					var activeTab = contentView.getActiveTab();
					if (activeTab.getStore) {
						me.loadRegisterGrid(activeTab);
					}
				}
			}
		};
			
		// Clicking on cancel button on the view page
		control['[xtype="' + me.shortName + '.viewtoolbar"] [xtype="shared.button.cancel"]'] = {
			click: function() {
				Ext.util.History.back();
			}
		};

		// Clicking on the New Entity button
		control['#new' + me.controller + 'Btn,#new' + me.controller + 'MenuBtn'] = {
			click: function() {
				me.addHistory(me.controller + ':showView');
			}
		};
		
		// Clicking on cancel button on the invoice view page
		control['[xtype="' + me.shortName + '.viewtoolbar"] [xtype="shared.button.cancel"]'] = {
			click: function() {
				Ext.util.History.back();
			}
		};

		control['[xtype="' + me.shortName + '.view"]'] = {
			destroy: me.onViewDestroy
		};

		control['[xtype="' + me.shortName + '.view"] [xtype="shared.invoicepo.viewheaderpickers"]'] = {
			vendorselectclick: me.onVendorSelectClick
		};

		control['#' + me.shortName + 'VendorSelectorWindow'] = {
			vendorselect: me.onVendorSelect
		};

		// Property combo on the invoice view page
		control['[xtype="' + me.shortName + '.view"] #entityPropertyCombo'] = {
			select: me.onPropertyComboSelect
		};

		// Vendor combo on the invoice view page
		control['[xtype="' + me.shortName + '.view"] #entityVendorCombo'] = {
			select: function() {
				me.onVendorComboSelect();
			}
		};

		// Invoice image panel
		control['[xtype="' + me.shortName + '.view"] [xtype="viewport.imagepanel"]'] = {
			expand: function() {
				me.showEntityImage = true;
				me.loadImage(true);
			},
			collapse: function() {
				me.showEntityImage = false;
			}
		};

		// Clicking the Edit button on the line item list
		control['#' + me.shortName + 'LineViewAddBtn'] = {
			click: me.onLineViewAddClick.bind(me)
		};

		// Clicking the Edit button on the line item list
		control['#' + me.shortName + 'LineEditBtn'] = {
			click: me.onLineEditClick.bind(me)
		};

		// Clicking on the Add Line button
		control['#' + me.shortName + 'LineAddBtn'] = {
			click: me.onLineAddClick.bind(me)
		};

		// Clicking on the Done With Changes button
		control['#' + me.shortName + 'LineSaveBtn'] = {
			click: me.onLineSaveClick.bind(me)
		};

		// Clicking on the Undo Changes button
		control['#' + me.shortName + 'LineCancelBtn'] = {
			click: me.onLineCancelClick.bind(me)
		};

		me.control(control);

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
			}

		NP.Keys.addShortcut(me.controller + ':showView:\\d+', [
			// Shortcut for clicking the Edit button on line item panel
			{
				title      : 'Edit Lines',
				key        : Ext.EventObject.E,
				fn         : me.onLineEditClick,
				scope      : me,
				conditionFn: function() {
					return !me.query('#' + me.shortName + 'LineEditBtn', true).isDisabled();
				}
			},
			// Shortcut for clicking the Add button on line item grid
			{
				title      : 'Add Line',
				key        : Ext.EventObject.A,
				fn         : function() { me.onLineViewAddClick(); },
				scope      : me,
				conditionFn: function() {
					return !me.query('#' + me.shortName + 'LineViewAddBtn', true).isDisabled();
				}
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
				title      : 'Save Invoice',
				key        : Ext.EventObject.U,
				fn         : function() { me.onSaveInvoice(); },
				scope      : me,
				conditionFn: function() {
					return me.query('#' + me.shortName + 'SaveBtn', true).isVisible();
				}
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
		var me = this;

		// Set the register view
		me.setView('NP.view.' + me.shortName + '.Register');

		// If no active tab is passed, default to Open
		if (!activeTab) var activeTab = 'open';
		
		// Check if the tab to be selected is already active, if it isn't make it the active tab
		var tab = Ext.ComponentQuery.query('#' + me.shortName + '_grid_' + activeTab)[0];
		var tabPanel = Ext.ComponentQuery.query('tabpanel')[0];
		
		// Set the active tab if it hasn't been set yet
		if (tab.getItemId() != tabPanel.getActiveTab().getItemId()) {
			tabPanel.setActiveTab(tab);
		}
		
		// Load the store
		me.loadRegisterGrid(tab);
	},

	populatePeriods: function(accounting_period, entity_period) {
		var me               = this,
			prefix           = me.shortName.toUpperCase(),
			periodBack       = parseInt(me.getSetting('CP.' + prefix + '_POST_DATE_BACK', '0')) * -1,
			periodForward    = parseInt(me.getSetting('CP.' + prefix + '_POST_DATE_FORWARD', '0')),
			periods          = [],
			periodField      = this.getCmp(me.shortName + '.view').findField(me.longName +'_period'),
			accountingPeriod = accounting_period,
			startPeriod,
			endPeriod,
			currentPeriod,
			entityPeriod;

		if (Ext.isString(accountingPeriod)) {
			accountingPeriod = Ext.Date.parse(accountingPeriod, 'Y-m-d');
		}
		startPeriod = accountingPeriod,
		endPeriod   = accountingPeriod

		if (arguments.length === 1) {
			entityPeriod = null;
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

		if (entityPeriod !== null) {
			entityPeriod = Ext.Date.parse(entity_period, NP.Config.getServerDateFormat());
			if (entityPeriod < startPeriod) {
				periods.unshift(entityPeriod);
			} else if (entityPeriod > endPeriod) {
				periods.push(entityPeriod);
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

	buildViewToolbar: function(data) {
		var me      = this,
			entity  = me.getEntityView().getModel(me.shortName + '.' + Ext.util.Format.capitalize(me.longName)),
			toolbar = me.getViewToolbar();

		data = data || {};
		
		Ext.applyIf(data, {
			is_approver: false,
			image      : null
		});

		toolbar.displayConditionData = {};

		data[me.longName] = entity;
		Ext.apply(toolbar.displayConditionData, data);

		toolbar.refresh();
	},

	getEntityRecord: function() {
		var me = this;
		return me.getEntityView().getModel(me.shortName + '.' + me.modelClass);
	},

	onVendorSelectClick: function() {
		var me  = this,
			win = Ext.create('NP.view.vendor.VendorSelectorWindow', {
					itemId : me.shortName + 'VendorSelectorWindow',
					store  : Ext.create('NP.store.vendor.Vendors', {
								service    : 'VendorService',
								action     : 'getVendorsForInvoice',
								paging     : true,
								extraParams: {
									property_id : me.query('#entityPropertyCombo', true).getValue(),
									useFavorites: false
			                    }
		                	}),
					tooltip: NP.Translator.translate('Select ' + me.displayName)
				});

		win.show();
	},

	onVendorSelect: function(win, rec) {
		var me    = this,
			combo = me.getVendorCombo();

		win.close();

		combo.setDefaultRec(rec);

		me.onVendorComboSelect(function() {
			NP.Net.remoteCall({
				requests: {
					service      : 'VendorService',
					action       : 'updateFavorite',
					vendorsite_id: me.getVendorRecord().get('vendorsite_id'),
					property_id  : me.getPropertyCombo().getValue(),
					op           : 'add'
				}
			});
		});
	},

	onLineViewAddClick: function() {
		var me = this;

		me.getLineMainView().getLayout().setActiveItem(1);

		me.onLineAddClick();
	},

	onLineEditClick: function() {
		var me    = this,
			grid  = me.getLineGrid(),
			store = grid.getStore();

		me.getLineMainView().getLayout().setActiveItem(1);

		if (store.getCount()) {
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
			lineNum = lines[lines.length-1].get(me.itemPrefix + '_linenum') + 1;
		}

		var rec = Ext.create(
			'NP.model.' + me.shortName + '.' + me.controller + 'Item',
			{
				// Default property to header property
				property_id    : propertyRec.get('property_id'),
				property_id_alt: propertyRec.get('property_id_alt'),
				property_name  : propertyRec.get('property_name'),
				
				// Default GL Account to vendor default GL account
				glaccount_id    : vendorRec.get('glaccount_id'),
				glaccount_number: vendorRec.get('glaccount_number'),
				glaccount_name  : vendorRec.get('glaccount_name')
			}
		);
		rec.set(me.itemPrefix + '_linenum', lineNum);

		store.add(rec);

		grid.getPlugin('cellediting').startEditByPosition({ row: lines.length, column: 1 });
	},

	onLineSaveClick: function() {
		var me          = this,
			cellEditing = me.getLineGrid().getPlugin('cellediting'),
			isValid     = me.validateLineItems();
		
		if (isValid) {
			if (cellEditing.editing) {
				cellEditing.completeEdit();
			}
			me.getLineMainView().getLayout().setActiveItem(0);
		} else {
			NP.Util.showFadingWindow({
				height: 110,
				html  : me.translate('You have one or more invalid line items. See the Line Items grid for details.')
			});
		}

		return isValid;
	},

	validateHeader: function(isSubmit) {
		var me      = this,
			form    = me.getEntityView(),
			isValid = true;

		Ext.suspendLayouts();

		form.getForm().clearInvalid();

		if (isSubmit) {
			isValid = form.isValid();

			var totalAmount   = me.getLineView().getTotalAmount(),
				controlAmount = form.findField('control_amount').getValue();

			if (controlAmount !== null && controlAmount != totalAmount) {
				form.findField('control_amount').markInvalid(
					me.translate(me.displayName + ' Total must be equal to line total.')
				);
				isValid = false;
			}
		} else {
			form.findField('property_id').isValid();
			form.findField('vendor_id').isValid();
			form.findField(me.longName + '_period').isValid();

			// We'll manually validate dates, that's because we don't want isValid() to return
			// false if the field is blank, but we do if the text in the field is invalid
			Ext.each(form.down('[xtype="datefield"]'), function(field) {
				var val = field.getValue();
				if (val !== null && !Ext.isDate(val)) {
					field.isValid();
				}
			});

			// Since we're not calling isValid on the form, we need to manually update our model
			me.getEntityView().updateBoundModels();

			isValid = !form.hasInvalidField();
		}

		Ext.resumeLayouts(true);

		return isValid;
	},

	validateLineItems: function() {
		var me                = this,
			grid              = me.getLineGrid(),
			cols              = grid.columnManager.getColumns(),
			store             = grid.getStore(),
			count             = store.getCount(),
			customFields      = NP.Config.getCustomFields().line.fields,
			reqFields         = ['glaccount_id','property_id'],
			nonZeroFields     = [me.itemPrefix + '_unitprice',me.itemPrefix + '_amount',me.itemPrefix + '_quantity'],
			unitFieldReq      = NP.Config.getSetting('PN.InvoiceOptions.unitFieldReq', '0'),
			jobCostingEnabled = me.getSetting('pn.jobcosting.jobcostingEnabled', '0'),
			useContracts      = me.getSetting('pn.jobcosting.useContracts', '0'),
			useChangeOrders   = me.getSetting('JB_UseChangeOrders', '0'),
			useJobCodes       = me.getSetting('pn.jobcosting.useJobCodes', '0'),
			usePhaseCodes     = me.getSetting('JB_UsePhaseCodes', '0'),
			phaseCodeReq      = me.getSetting('PN.jobcosting.phaseCodeReq', '0'),
			useCostCodes      = me.getSetting('pn.jobcosting.useCostCodes', '0'),
			valid             = true,
			fieldNum,
			rec;

		if (unitFieldReq == 1) {
			reqFields.push('unit_id');
		}

		for (fieldNum in customFields) {
			if (customFields[fieldNum].invOn && customFields[fieldNum].invRequired) {
				reqFields.push('universal_field' + fieldNum);
			}
		}

		Ext.suspendLayouts();

		// Go through every line to validate it
		for (var i=0; i<count; i++) {
			rec = store.getAt(i);
			for (var j=0; j<cols.length; j++) {
				var error = null,
					col   = cols[j],
					val   = rec.get(col.dataIndex);

				if (Ext.Array.contains(reqFields, col.dataIndex) && (val === null || val === '')) {
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
				
				if (error === null && me.validateLineItem) {
					error = me.validateLineItem(rec, col, val);
				}

				if (error != null) {
					me.getLineMainView().getLayout().setActiveItem(1);

					// We'll use the deferUntil() utility function because in cases where the grid
					// was never shown, the getCell() call will fail until the grid has been fully
					// renderer following the setActiveItem(1) call above
					NP.Util.deferUntil(function markInvalidCells(recInner, colInner) {
						var cellNode = grid.getView().getCell(recInner, colInner);
						cellNode.addCls('grid-invalid-cell');
						cellNode.set({
							'data-qtip': me.translate(error)
						});
					}, { args: [rec, col] });
					
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

	onBeforeLineGridEdit: function(editor, e) {
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

		if (field && field.getStore) {
			// Delete the last query on the combo, otherwise we get weird cases where
			// the field is blank and the combo still doesn't pull any records
			delete field.lastQuery;

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

		if (e.field == me.itemPrefix + '_quantity' || e.field == me.itemPrefix + '_unitprice' 
				|| e.field == me.itemPrefix + '_amount' || e.field == me.itemPrefix + '_description') {
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
		} else if (e.field == 'vcitem_number' || e.field == 'vcitem_uom') {
			me.onOpenVcField(editor, e.grid, e.record, field);
		} else if (e.field == 'utilityaccount_id') {
			me.onOpenUtilityAccountEditor(editor, e.record, field);
		} else if (e.field == 'utilitycolumn_usagetype_id') {
			me.onOpenUsageTypeEditor(editor, e.record, field);
		} else if (e.field.substr(0, 15) == 'universal_field') {
			me.onOpenCustomFieldEditor(editor, e.grid, e.record, field);
		}
	},

	onOpenInvalidSplitField: function(editor, rec, field) {
		var me = this;

		if (rec.get(me.itemPrefix + '_split') === 1) {
			field.setReadOnly(true);
		} else {
			field.setReadOnly(false);
		}
	},

	onOpenPropertyEditor: function(editor, grid, rec, field) {
		var me            = this,
			propertyField = me.getPropertyCombo(),
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

		if (store.extraParamsHaveChanged() && grid.selectedRec.get('property_id') !== null) {
			store.removeAll();
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
            	store.addExtraParams({ property_id: property_id });
            }
        // Otherwise run code for associating with integration package
        } else {
        	var integration_package_id = me.getEntityView().getLoadedData().integration_package_id;
        	if (integration_package_id != store.getExtraParam('integration_package_id')) {
        		store.addExtraParams({ integration_package_id: integration_package_id });
    		}
        }
	},

	onOpenGlAccountEditor: function(editor, grid, rec, field) {
		var me    = this,
			store = grid.glStore;

		me.setGlExtraParams(grid, rec);

		if (store.extraParamsHaveChanged() && grid.selectedRec.get('glaccount_id') !== null) {
			store.removeAll();
			store.add(grid.selectedRec.getData());
		}
	},

	onOpenUnitEditor: function(editor, grid, rec, field) {
		var me          = this,
    		combo       = me.getLineGridUnitCombo(),
    		property_id = rec.get('property_id'),
    		store       = grid.unitStore;

    	if (property_id !== null) {
        	store.addExtraParams({ property_id: property_id });
        }

        if (store.extraParamsHaveChanged() && grid.selectedRec.get('unit_id') !== null) {
			store.removeAll();
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
	        if (store.extraParamsHaveChanged() && !Ext.isEmpty(val)) {
				store.removeAll();
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

        if (store.extraParamsHaveChanged() && grid.selectedRec.get('jbcontract_id') !== null) {
			store.removeAll();
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

        if (store.extraParamsHaveChanged() && grid.selectedRec.get('jbchangeorder_id') !== null) {
			store.removeAll();
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

        if (store.extraParamsHaveChanged() && grid.selectedRec.get('jbjobcode_id') !== null) {
			store.removeAll();
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

        if (store.extraParamsHaveChanged() && grid.selectedRec.get('jbphasecode_id') !== null) {
			store.removeAll();
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

        if (store.extraParamsHaveChanged() && grid.selectedRec.get('jbcostcode_id') !== null) {
			store.removeAll();
			store.add(grid.selectedRec.getData());
		}
	},

	onOpenVcField: function(editor, grid, rec, field) {
		field.setReadonly((rec.get('is_from_catalog') == 1));
	},

	onAfterLineGridEdit: function(editor, e) {
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
				// If there's a Utlity Account set in the column, it would not longer be valid with a property change
				// so clear it
				if (utilityaccount_id !== null) {
					me.clearUtilityAccount();
				}
			}
		}
	},

	onStoreUpdateLine: function(store, rec, operation, modifiedFieldNames) {
		if (operation == Ext.data.Model.EDIT) {
			var me = this;

            // Set the job costing flag accordingly
            var item_jobflag = ( rec.get('jbjobcode_id') !== null ) ? 1 : 0;
            rec.set(me.itemPrefix + '_jobflag', item_jobflag);

            // See if the tax and shipping needs to be recalculated
            var taxUpdated = false;
            for (var i=0; i<modifiedFieldNames.length; i++) {
            	var field = modifiedFieldNames[i];
            	if (field == me.itemPrefix + '_taxflag') {
            		if (rec.get(me.itemPrefix + '_taxflag') == 'N') {
            			rec.set(me.itemPrefix + '_salestax', 0);
            		}
            		if (!taxUpdated) {
	            		me.onChangeTaxTotal();
	            		taxUpdated = true;
	            	}
            	} else if (field == me.itemPrefix + '_amount') {
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
			recs         = store.query(me.itemPrefix + '_taxflag', 'Y'),
			taxableTotal = 0,
			totalTax     = me.getTaxField().getValue();

		recs.each(function(rec) {
			taxableTotal += rec.get(me.itemPrefix + '_amount');
		});

		recs.each(function(rec) {
			var amount = rec.get(me.itemPrefix + '_amount');
			rec.set(me.itemPrefix + '_salestax', (amount / taxableTotal) * totalTax);
		});

		tpl.updateTotals();
	},

	onChangeShippingTotal: function() {
		var me        = this,
			tpl       = me.getLineDataView().tpl,
			store     = me.getLineGrid().getStore(),
			total     = tpl.getSum(me.itemPrefix + '_amount'),
			totalShip = me.getShippingField().getValue();

		store.each(function(rec) {
			var amount = rec.get(me.itemPrefix + '_amount');
			rec.set(me.itemPrefix + '_shipping', (amount / total) * totalShip);
		});

		tpl.updateTotals();
	},

	onChangeQuantity: function(grid, field) {
		var me        = this,
			unitPrice = grid.selectedRec.get(me.itemPrefix + '_unitprice'),
			qty       = field.getValue();

		grid.selectedRec.set(me.itemPrefix + '_amount', qty * unitPrice);
	},

	onChangeUnitPrice: function(grid, field) {
		var me        = this,
			qty       = grid.selectedRec.get(me.itemPrefix + '_quantity'),
			unitPrice = field.getValue();

		grid.selectedRec.set(me.itemPrefix + '_amount', qty * unitPrice);
	},

	onChangeAmount: function(grid, field) {
		var me        = this,
			qty   = grid.selectedRec.get(me.itemPrefix + '_quantity'),
			amount = field.getValue();

		grid.selectedRec.set(me.itemPrefix + '_unitprice', amount / qty);
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
			data         = me.getEntityView().getLoadedData(),
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
	        
	        iframeId = me.shortName + '-image-iframe-' + imageRegion;
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

	onViewDestroy: function() {
		var panels = Ext.ComponentQuery.query('[xtype="viewport.imagepanel"]');
		
		Ext.suspendLayouts();
		for (var i=0; i<panels.length; i++) {
			panels[i].hide();
		}
		Ext.resumeLayouts(true);
	},

	onPropertyComboSelect: function(propertyCombo, recs) {
		var me            = this,
			form          = me.getEntityView(),
			vendorCombo   = me.getVendorCombo(),
			periodField   = form.findField(me.longName + '_period'),
			currentPeriod = me.getEntityRecord().get(me.longName + '_period');
		
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

	onVendorComboSelect: function(callback) {
		var me          = this,
			entity_id   = me.getEntityRecord().get(me.pk),
			vendorField = me.getVendorCombo(),
			dialogTitle = me.translate('Change Vendor?'),
			dialogText  = me.translate('Please note, when changing the vendor, all line items and previous approvals will be deleted from this ' + me.displayName + '. Are you sure you want to proceed?');

		callback = callback || Ext.emptyFn;

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
					if (entity_id === null) {
						me.changeVendor();

						callback();
					// Ajax request to change vendor
					} else {
						me.checkLock(function() {
							var req = {
								service   : me.service,
								action    : 'changeVendor',
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

										callback();
									}
								}
							};

							req[me.pk] = entity_id;

							NP.Net.remoteCall({
								mask    : me.getEntityView(),
								requests: req
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
			invoice_id = me.getEntityRecord().get(me.pk),
			form       = me.getEntityView(),
			formData   = form.getLoadedData(),
			vendor     = me.getVendorRecord();

		Ext.suspendLayouts();

		// Show the vendor info
		me.setVendorDisplay();

		// Remove all line items
		me.getLineGrid().getStore().removeAll();

		// Enable the add and edit line item button
		me.getLineEditBtn().enable();
		me.getLineAddBtn().enable();

		if (me.shortName == 'invoice') {
			me.loadUtilityAccounts();
		}

		// Set the default remit advice for the vendor
		form.findField('remit_advice').setValue(vendor.get('remit_req'));
		
		if (invoice_id !== null) {
			me.buildViewToolbar(formData);
		}

		Ext.resumeLayouts(true);
	},

	getVendorRecord: function() {
		var me          = this,
			vendorField = me.getVendorCombo();

		if (vendorField.getValue() !== null) {
			return vendorField.findRecordByValue(vendorField.getValue());
		}

		return null;
	},

	getPropertyRecord: function() {
		var me          = this,
			propField   = me.getPropertyCombo();

		if (propField.getValue() !== null) {
			return propField.findRecordByValue(propField.getValue());
		}

		return null;
	},

	setVendorDisplay: function() {
		var me            = this,
			vendorDisplay = Ext.ComponentQuery.query('#vendorDisplay')[0],
			vendorField   = me.getVendorCombo();

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
			invoice    = me.getEntityRecord(),
			invoice_id = invoice.get(me.pk);

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
								me.translate(me.displayName + ' Updated'),
								me.translate('The ' + me.displayName + ' has been updated by another user and is being reloaded')
							);

							me.showView(invoice_id);
						}
					}
				}
			});
		}
	},

	onDeleteLineClick: function(lineRec) {
		var me        = this,
			lineStore = me.getLineDataView().getStore();

		lineStore.remove(lineRec);
	},

	onEditLineClick: function(lineRec) {
		var me   = this,
			grid = me.getLineGrid(),
			row  = grid.getStore().indexOf(lineRec);

		this.getLineMainView().getLayout().setActiveItem(1);

		Ext.defer(function() {
			grid.getPlugin('cellediting').startEditByPosition({ row: row, column: 1 });
		}, 50);
	},

	onSplitLineClick: function(lineRec) {
		var me              = this,
			vendorsite_id   = me.getVendorRecord().get('vendorsite_id'),
			win             = Ext.create('NP.view.shared.invoicepo.SplitWindow', {
								type: me.shortName
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
			me.isNewSplit       = (lineRec.get(me.itemPrefix + '_split') !== 1);

			win.down('#splitDescription').setValue(lineRec.get(me.itemPrefix + '_description'));
			win.down('#splitUnitPrice').setValue(lineRec.get(me.itemPrefix + '_unitprice'));

			if (me.isNewSplit) {
				win.down('#splitTotalQty').setValue(lineRec.get(me.itemPrefix + '_quantity'));

				var newRec = lineRec.copy();
				newRec.set('split_percentage', 100);
				splitStore.add(newRec);
			} else {
				var splitRecs = me.getSplitLines(me.openSplitLineRec),
					totalQty  = 0;

				splitRecs.each(function(splitRec) {
					totalQty += splitRec.get(me.itemPrefix + '_quantity');
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
			desc       = rec.get(me.itemPrefix + '_description'),
			unitPrice  = rec.get(me.itemPrefix + '_unitprice'),
			recs;

		recs = lineStore.queryBy(function(lineRec, id) {
			if (
				lineRec.get(me.itemPrefix + '_description') == desc
				&& lineRec.get(me.itemPrefix + '_unitprice') == unitPrice
				&& lineRec.get(me.itemPrefix + '_split') == 1
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
							newRec.set(me.itemPk, null);
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

		rec.set(me.itemPrefix + '_unitprice', unitPrice);
		rec.set(me.itemPrefix + '_quantity', splitQty);
		rec.set(me.itemPrefix + '_amount', newAmount);

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
		
		grid.selectedRec.set('split_percentage', splitPct);
		grid.selectedRec.set(me.itemPrefix + '_quantity', splitQty);

		grid.getStore().each(function(rec) {
			rec.set('split_balance', 0);
		});
	},

	onAddSplitLine: function() {
		var me = this,
			rec = me.openSplitLineRec.copy();

		rec.set(me.itemPk, null);

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
				amountAllocated += rec.get(me.itemPrefix + '_amount');
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
			allocLeft    = parseFloat(Ext.ComponentQuery.query('#allocation_amount_left')[0].getValue());

		if (allocLeft >= 0.000001 || allocLeft <= -0.000001) {
			Ext.MessageBox.alert(
				me.translate('Error'),
				me.translate('You have allocated too little or too much money.')
			);
		} else {
			var splitStore   = me.getSplitGrid().getStore(),
				totalRecs    = splitStore.getCount(),
				lineDataView = me.getLineDataView(),
				lineStore    = me.getLineGrid().getStore(),
				desc         = Ext.ComponentQuery.query('#splitDescription')[0].getValue(),
				rec,
				lineRec,
				i;

			Ext.suspendLayouts();

			if (me.isNewSplit) {
				rec = splitStore.getById(me.openSplitLineRec.get(me.itemPk));
				if (!rec) {
					lineStore.remove(me.openSplitLineRec);
				}
			} else {
				var oldRecs = me.getSplitLines(me.openSplitLineRec);

				oldRecs.each(function(lineRec) {
					var item_id = lineRec.get(me.itemPk);
					rec = splitStore.getById(item_id);
					if (item_id === null || rec === null) {
						lineStore.remove(lineRec);
					}
				});
			}
			
			me.openSplitLineRec = null;

			for (i=0; i<totalRecs; i++) {
				lineRec = null;
				rec = splitStore.getAt(i);
				if (rec.get(me.itemPk) !== null) {
					lineRec = lineStore.getById(rec.get(me.itemPk));
				}
				if (lineRec) {
					var data = rec.getData();
					data[me.itemPrefix + '_description'] = desc;
					data[me.itemPrefix + '_split'] = 1;
					lineRec.set(data);
				} else {
					rec.set(me.itemPrefix + '_description', desc);
					rec.set(me.itemPrefix + '_split', 1);
					lineStore.add(rec);
				}
			}

			lineDataView.refresh();

			Ext.resumeLayouts(true);

			me.getSplitWindow().close();
		}
	},

	setReadOnly: function(readonly) {
		var me     = this,
			form   = me.getEntityView(),
			fields = form.getForm().getFields(),
			status = me.getEntityRecord().get(me.longName + '_status'),
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

		// Enable/disable the add and edit line button
		if (readonly) {
			me.getLineEditBtn().disable();
			me.getLineAddBtn().disable();
		} else {
			me.getLineEditBtn().enable();
			if (status == 'paid') {
				me.getLineAddBtn().disable();
			} else {
				me.getLineAddBtn().enable();
			}
		}

		// Enable/disable the tax/shipping fields
		NP.Util.deferUntil(function() {
			me.query('#entity_tax_amount', true).setReadOnly(readonly);
			me.query('#entity_shipping_amount', true).setReadOnly(readonly);
		});

		Ext.resumeLayouts(true);
	},

	onSaveInvoice: function(callback) {
		var me      = this,
			invoice = me.getEntityRecord();

		// Before saving, make sure invoice hasn't been updated
		me.saveInvoice(
			me.service,
			'saveInvoice',
			{},
			false,
			function(result) {
				if (callback) {
					callback(result);
				} else {
					// Show info message
					NP.Util.showFadingWindow({ html: me.displayName + ' saved successfully' });

					if (invoice.get(me.pk) === null) {
						me.addHistory(me.controller + ':showView:' + result[me.pk]);
					} else {
						me.getEntityRecord().set('lock_id', result.lock_id);

						// TODO: need to account for UI changes that may be required on a save
					}
				}
			}
		);
	},

	saveInvoice: function(service, action, extraParams, validateAll, callback) {
		var me      = this,
			form    = me.getEntityView(),
			invoice = me.getEntityRecord();

		if (me.onLineSaveClick() && me.validateHeader(validateAll)) {
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
			invoice_id  = me.getEntityRecord().get(me.pk),
			form        = me.getEntityView(),
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

								me.addHistory(me.controller + ':showRegister');
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
			data = me.getEntityView().getLoadedData();

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
			win   = Ext.widget('shared.invoicepo.imagesmanagewindow', { itemId: me.shortName + 'ManageImageWin', type: me.shortName }),
			store = win.down('customgrid').getStore();

		store.addExtraParams({
			entity_id: me.getEntityRecord().get(me.pk)
		});
		store.load();

		win.show();
	},

	onDeleteImage: function() {
		var me          = this,
			form        = me.getEntityView(),
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
							entity_id          : me.getEntityRecord().get(me.pk),
							image_index_id_list: recs,
							success            : function(result) {
								var data = me.getEntityView().getLoadedData();

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

					me.getEntityView().getLoadedData()['image'] = rec.getData();
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
			win   = Ext.widget('shared.invoicepo.imagesaddwindow', { itemId: me.shortName + 'AddImageWin', type: me.shortName }),
			store = win.down('customgrid').getStore();

		store.addExtraParams({
			vendor_id: me.getVendorCombo().getValue()
		});
		store.load();

		win.show();
	},

	onAddImageSave: function() {
		var me   = this,
			form = me.getEntityView(),
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
					entity_id          : me.getEntityRecord().get(me.pk),
					image_index_id_list: recs,
					success            : function(result) {
						var data = me.getEntityView().getLoadedData();

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
			data     = me.getEntityView().getLoadedData(),
			uploader = Ext.create('NP.lib.ui.Uploader', {
	            params: {
	            	files: {
	            		extensions : '*.pdf; *.doc; *.docx; *.ppt; *.pptx; *.xls; *.xlsx; *.jpeg; *.jpg; *.gif; *.tif; *.tiff',
	            		description: 'Image Files'
	            	},
	                form: {
						service  : me.service,
						action   :  'uploadImage',
						entity_id: me.getEntityRecord().get(me.pk)
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
            property_id   = me.getEntityView().findField('property_id').getValue(),
            vendorsite_id = me.getVendorRecord().get('vendorsite_id');
        
        if (!vendorsite_id || !property_id) {
            Ext.MessageBox.alert('Use Template', 'You must select a property and vendor.');
            return;
        }

        var win = Ext.create('NP.view.invoice.UseTemplateWindow', {
            itemId               : me.shortName + 'ApplyTemplateWin',
            property_id          : property_id,
            vendorsite_id        : vendorsite_id
        });

        win.show();
	},

    onApplyTemplateSave: function(win, template_id) {
        var me         = this,
        	invoice_id = me.getEntityRecord().get(me.pk);

        me.checkLock(function() {
        	NP.Net.remoteCall({
        		method  : 'POST',
        		mask    : me.getEntityView(),
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

    onSubmitForPayment: function() {
    	var me         = this,
        	invoice_id = me.getEntityRecord().get(me.pk);

        me.onSaveInvoice(function(result) {
        	NP.Net.remoteCall({
        		method  : 'POST',
        		mask    : me.getEntityView(),
        		requests: {
					service    : me.service,
					action     : 'submitForPayment',
					invoice_id : invoice_id,
					success    : function(result) {
						if (result.success) {
							// Show notification
							NP.Util.showFadingWindow({
								html: me.translate('The invoice was successfully submitted')
							});

							// Refresh the invoice
							me.showView(invoice_id);
						} else if (result.errors[0].field === 'jobcosting') {
							Ext.MessageBox.alert(
								me.translate('Error'),
								me.translate(result.errors[0].msg)
							);
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
	        		mask    : me.getEntityView(),
	        		requests: {
						service    : me.service,
						action     : 'modifyInvoice',
						invoice_id : me.getEntityRecord().get(me.pk),
						success    : function(result) {
							if (result.success) {
								me.getEntityRecord().set({
									invoice_status       : 'open',
									invoice_submitteddate: null
								});

								Ext.suspendLayouts();
								
								me.buildViewToolbar(me.getEntityView().getLoadedData());
								me.setReadOnly(false);
								
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
    		type: me.shortName
    	});

    	win.show();
    },

    onRejectSave: function() {
    	var me            = this,
    		win           = me.getCmp('shared.invoicepo.rejectwindow'),
    		form          = win.down('form'),
    		invoice_id    = me.getEntityRecord().get(me.pk),
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
    }
});