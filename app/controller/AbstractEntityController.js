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
		'NP.lib.core.KeyManager',
		'NP.model.system.RecurringScheduler'
	],
	
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
			{ ref: 'forwardsGrid', selector: '[xtype="shared.invoicepo.forwardsgrid"]' },
			{ ref: 'historyLogGrid', selector: '[xtype="shared.invoicepo.historyloggrid"]' },
			{ ref: 'warningsView', selector: '[xtype="shared.invoicepo.viewwarnings"] dataview' },
			{ ref: 'lineGridPropertyCombo',selector: '#lineGridPropertyCombo' },
			{ ref: 'lineGridGlCombo', selector: '#lineGridGlCombo' },
			{ ref: 'lineGridUnitCombo', selector: '#lineGridUnitCombo' },
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
			// Clicking the Edit link
			clickeditline  : me.onEditLineClick.bind(me),
			// Clicking the Split link
			clicksplitline : me.onSplitLineClick.bind(me),
			// Clicking the Edit Split link
			clickeditsplit : me.onSplitLineClick.bind(me),
			// Clicking the Delete link
			clickdeleteline: me.onDeleteLineClick.bind(me),
			// Clicking on the PO number link
			clickporef     : me.onPoRefClick.bind(me),
			// Clicking on an invoice number link
			clickinvoiceref: me.onInvoiceRefClick.bind(me),
			// Clicking on a receipt number link
			clickreceiptref: me.onReceiptRefClick.bind(me),
			// Clicking on the Cancel link on a line 
			clickcancelline: me.onCancelLine.bind(me),
			// Clicking on the Restore link on a line
			clickrestoreline: me.onRestoreLine.bind(me),
			// Clicking on the Modify GL link
			clickmodifygl  : me.onEditLineClick.bind(me),
			// Clicking on the Show Budget link
			clickshowbudget  : me.onShowBudgetDetail.bind(me),
			// Changing Tax or Shipping
			changetaxtotal     : me.onChangeTaxTotal.bind(me),
			changeshippingtotal: me.onChangeShippingTotal.bind(me)
		};

		// Split window
		control['#' + me.shortName + 'SplitWin'] = {
			close: me.onCloseSplitWindow.bind(me)
		};

		// Split grid
		control['#' + me.shortName + 'SplitWin customgrid'] = {
			beforeedit      : me.onBeforeLineGridEdit.bind(me),
			changepercentage: me.onChangeSplitPercentage.bind(me),
			changeamount    : me.onChangeSplitAmount.bind(me),
			tablastfield    : me.onAddSplitLine.bind(me)
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
				me.onSaveEntity();
			}
		};

		// Delete invoice button
		control['#' + me.shortName + 'DeleteBtn'] = {
			click: me.onDeleteEntity
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

		control['#' + me.shortName + 'ForwardBtn'] = {
			click: function() {
				me.onForward(false);
			}
		};

		control['#' + me.shortName + 'ForwardWin [xtype="shared.button.message"]'] = {
			click: me.onForwardSend
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
		control['[xtype="viewport.imagepanel"]'] = {
			expand: function() {
				var token = Ext.History.getToken().split(':');
				if (token[0] == me.controller) {
					me.showEntityImage = true;
					me.loadImage();
				}
			},
			collapse: function() {
				var token = Ext.History.getToken().split(':');
				if (token[0] == me.controller) {
					me.showEntityImage = false;
				}
			}
		};

		// History log grid
		control['[xtype="' + me.shortName + '.view"] [xtype="shared.invoicepo.historyloggrid"]'] = {
			showdetails: me.onShowHistoryDetail.bind(me)
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
		// TODO: permanently remove this once confirmed this functionality is not needed
		control['#' + me.shortName + 'LineCancelBtn'] = {
			click: me.onLineCancelClick.bind(me)
		};

		// Clicking on the Create Copy button
		control['#' + me.shortName + 'CreateCopy'] = {
			click: me.onCreateCopy.bind(me)
		};

		// Clicking on the Save button in the Schedule window
		control['#' + me.shortName + 'CopyTemplateWin [xtype="shared.button.save"]'] = {
			click: me.onSaveCopy.bind(me)
		};

		// Clicking on the Save as Template button
		control['#' + me.shortName + 'SaveTemplateBtn'] = {
			click: function() {
				me.onSaveAsTemplate(false);
			}
		};

		// Clicking on the Save as User Template button
		control['#' + me.shortName + 'SaveUserTemplateBtn'] = {
			click: function() {
				me.onSaveAsTemplate(true);
			}
		};

		// Clicking on the Save button on the Save Template window
		control['#' + me.shortName + 'SaveTemplateWin [xtype="shared.button.save"]'] = {
			click: me.onSaveAsTemplateSave.bind(me)
		};

		// Clicking on the Save button in the Schedule window
		control['#' + me.shortName + 'UseTemplateBtn'] = {
			click: me.onUseTemplate.bind(me)
		};

		// Clicking on the Create Schedule button
		control['#' + me.shortName + 'CreateSchedule'] = {
			click: me.onCreateSchedule.bind(me)
		};

		// Clicking on the Modify Schedule button
		control['#' + me.shortName + 'ModifySchedule'] = {
			click: me.onCreateSchedule.bind(me)
		};

		// Clicking on the Delete button in the Schedule window
		control['#' + me.shortName + 'ScheduleDeleteBtn'] = {
			click: me.onDeleteSchedule.bind(me)
		};

		// Clicking on the Save button in the Schedule window
		control['#' + me.shortName + 'ScheduleSaveBtn'] = {
			click: me.onSaveSchedule.bind(me)
		};

		// Clicking on the Change Property button
		control['#' + me.shortName + 'ChangePropertyBtn'] = {
			click: me.onChangeProperty.bind(me)
		};

		// Clicking on the Change Property button
		control['#' + me.shortName + 'ChangePropertySaveBtn'] = {
			click: me.onChangePropertySave.bind(me)
		};

		// Clicking on the Show Audit Trail button on history log grid
		control['#' + me.shortName + 'showAuditTrailBtn'] = {
			click: me.onShowAuditTrail.bind(me)
		};

		control['#' + me.shortName + 'BudgetDetailWindow [xtype="shared.button.search"]'] = {
			click: me.onViewBudgetDetailsBy.bind(me)
		};

		control['#' + me.shortName + 'ReadyForProcessingBtn'] = {
			click: me.onReadyForProcessing.bind(me)
		};

		control['#' + me.shortName + 'SubmitForApprovalBtn'] = {
			click: function() {
				me.onSubmitForApproval(false);
			}
		};

		control['#' + me.shortName + 'SubmitForApprovalAndNextBtn'] = {
			click: function() {
				me.onSubmitForApproval(true);
			}
		};

		control['#' + me.shortName + 'SubmitAndRouteBtn'] = {
			click: me.onSubmitAndRoute
		};

		control['#' + me.shortName + 'RouteBtn'] = {
			click: me.onRoute
		};

		control['#' + me.shortName + 'RouteSaveBtn'] = {
			click: me.onRouteSave
		};

		control['#' + me.shortName + 'ApproveBtn'] = {
			click: me.onApprove
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

		NP.Keys.addShortcut(me.controller + ':showView(:\\d+)?', [
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
			// Shortcut for clicking the Add Line button on line item grid
			{
				title      : 'Add Lines',
				key        : Ext.EventObject.A,
				fn         : me.onLineAddClick,
				scope      : me,
				conditionFn: function() {
					return (
						editCondition()
						&& !me.query('#' + me.shortName + 'LineAddBtn', true).isDisabled()
					);
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
				fn         : function() { me.onSaveEntity(); },
				scope      : me,
				conditionFn: function() {
					return me.query('#' + me.shortName + 'SaveBtn', true).isVisible();
				}
			},
			// Shortcut for processing invoice
			{
				title      : 'Ready for Processing',
				key        : Ext.EventObject.Y,
				fn         : me.onReadyForProcessing,
				scope      : me,
				conditionFn: function() {
					return me.query('#' + me.shortName + 'ReadyForProcessingBtn', true).isVisible();
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
			currentPeriod;

		if (Ext.isString(accountingPeriod)) {
			accountingPeriod = Ext.Date.parse(accountingPeriod, 'Y-m-d');
		}
		startPeriod = accountingPeriod,
		endPeriod   = accountingPeriod

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

		if (arguments.length > 1) {
			if (!Ext.isDate(entity_period)) {
				entity_period = Ext.Date.parse(entity_period, NP.Config.getServerDateFormat());
			}
			
			if (entity_period < startPeriod) {
				periods.unshift(entity_period);
			} else if (entity_period > endPeriod) {
				periods.push(entity_period);
			}
		}

		// Add all the periods to the store
		Ext.each(periods, function(period) {
			periodField.getStore().add({
				accounting_period_display: Ext.Date.format(period, 'm/Y'),
				accounting_period        : Ext.Date.format(period, NP.Config.getServerDateFormat())
			});
		});

		if (entity_period) {
			periodField.setValue(Ext.Date.format(entity_period, NP.Config.getServerDateFormat()));
		}
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

	setPropertyFieldState: function(invoice_status) {
		var me    = this,
			field = me.getPropertyCombo();

		// Only allow changing the property field if the entity is new
		if (me.getEntityRecord().get(me.pk) === null) {
			field.setReadOnly(false);
		} else {
			field.setReadOnly(true);
		}
	},

	setReadOnly: function(readonly) {
		var me           = this,
			form         = me.getEntityView(),
			fields       = form.getForm().getFields(),
			status       = me.getEntityRecord().get(me.longName + '_status'),
			customShowFn = 'hide',
			noteShowFn   = 'hide',
			field,
			i;

		Ext.suspendLayouts();

		// Loop through all the form fields and make them read-only
		for (i=0; i<fields.getCount(); i++) {
			field = fields.getAt(i);
			// Make sure the field has a setReadOnly function
			if (field.setReadOnly && field.getItemId() != 'entityPropertyCombo') {
				// Set the readonly status to the appropriate value
				field.setReadOnly(readonly);
				
				if (readonly) {
					// If the field has no value, hide it
					if (Ext.isEmpty(field.getValue())) {
						field.hideMode = 'display';
						field.hide();
					// Otherwise if the field has a value, show it
					} else {
						// If the field is a custom field, take note of the fact that there's a
						// custom field with a value set (to be used later)
						if (field.getXType() == 'shared.customfield') {
							customShowFn = 'show';
						} else if (field.up('[xtype="shared.invoicepo.viewnotes"]')) {
							noteShowFn = 'show';
						}
						field.show();
					}
				}
			}
		}

		// If there's no custom field or note with a value set, hide the whole panel
		if (readonly) {
			var customContainer = me.getCmp('shared.customfieldcontainer');
			customContainer[customShowFn]();

			// Check custom field columns for values
			if (customShowFn) {
				var cols = customContainer.query('container[flex=1]'),
					hasVisible;

				Ext.each(cols, function(col) {
					hasVisible = false;
					col.items.each(function(field) {
						if (field.isVisible()) {
							hasVisible = true;
							return false;
						}
					});

					if (!hasVisible) {
						col.hide();
					}
				});
			}

			me.getCmp('shared.invoicepo.viewnotes')[noteShowFn]();
		}

		// Enable/disable the add and edit line button
		if (readonly) {
			me.getLineEditBtn().disable();
		} else {
			me.getLineEditBtn().enable();
		}

		// Enable/disable the tax/shipping fields
		var lineStore = me.getLineDataView().getStore();
		if (lineStore.getCount()) {
			me.query('#entity_tax_amount', true).setReadOnly(readonly);
			me.query('#entity_shipping_amount', true).setReadOnly(readonly);
		}

		// Make sure the created on field is always readonly
		if (me.shortName == 'invoice') {
			me.getEntityView().findField('invoice_createddatetm').setReadOnly(true);
		} else if (me.shortName == 'po') {
			me.getEntityView().findField('purchaseorder_created').setReadOnly(true);
		}

		Ext.resumeLayouts(true);
	},

	setVendorFieldState: function(status) {
		var me     = this,
			field  = me.getVendorCombo(),
			el     = Ext.get('entityVendorSelectOption'),
			showFn = 'hide';

		// Only allow changing the property field if the invoice is open or a draft
		if (status == 'draft' || status == 'open') {
			field.enable();
			if (NP.Security.hasPermission(1024) && NP.Security.hasPermission(6065)) {
				showFn = 'show';
			}
		} else {
			field.disable();
		}

		if (el) {
			el.setVisibilityMode(Ext.Element.DISPLAY);
			el[showFn]();
		}
	},

	setRequiredNotes: function() {
		var me           = this,
			lineStore    = me.getLineDataView().getStore(),
			overageNotes = me.getEntityView().findField(me.longName + '_budgetoverage_note'),
			allowBlank   = true;

		if (NP.Security.hasPermission(2002)) {
			lineStore.each(function(rec) {
				if (rec.get('budget_variance') < 0) {
					allowBlank = false;
					return false;
				}
			});
		}

		overageNotes.setAllowBlank(allowBlank);
	},

	getEntityRecord: function() {
		var me = this;
		return me.getEntityView().getModel(me.shortName + '.' + me.modelClass);
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

	getLineGrid: function() {
		var me   = this,
			grid = me.query('#splitGrid', true);

		if (grid === null) {
			grid = me.getCmp('shared.invoicepo.viewlinegrid');
		}
		return grid;
	},

	onPropertyComboSelect: function(propertyCombo, recs) {
		var me            = this,
			form          = me.getEntityView(),
			vendorCombo   = me.getVendorCombo(),
			periodField   = form.findField(me.longName + '_period'),
			currentPeriod = me.getEntityRecord().get(me.longName + '_period'),
			property_id   = null;
		
		// Remove all periods from the period store
		periodField.getStore().removeAll();

		if (recs.length) {
			property_id = recs[0].get('property_id');

			vendorCombo.enable();
			NP.Net.remoteCall({
				requests: {
					service    : 'PropertyService',
					action     : 'getAccountingPeriod',
					property_id: property_id,
					success    : function(result) {
						var period = Ext.Date.parse(result['date'], NP.Config.getServerSmallDateFormat());
						if (currentPeriod === null) {
							currentPeriod = period;
						}
						me.populatePeriods(period, currentPeriod);
					}
				}
			});
		} else {
			vendorCombo.disable();
		}

		me.getEntityRecord().set('property_id', property_id);
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
					me.changeVendor();

					callback();
				} else {
					restoreVendor();
				}
			});
		} else {
			me.changeVendor();
		}
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

	changeVendor: function() {
		var me          = this,
			entity      = me.getEntityRecord(),
			form        = me.getEntityView(),
			formData    = form.getLoadedData(),
			vendor      = me.getVendorRecord(),
			lineStore   = me.getLineGrid().getStore(),
			vendorField = (me.shortName == 'invoice') ? 'paytablekey_id' : 'vendorsite_id';

		Ext.suspendLayouts();

		// Set the vendor field on the entity record
		entity.set(vendorField, vendor.get('vendorsite_id'));

		// Show the vendor info
		me.setVendorDisplay();

		// Remove all line items (can't call removeAll, otherwise we lose list of added/removed/modified records)
		lineStore.remove(lineStore.getRange());
		
		// Enable the add and edit line item button
		me.getLineEditBtn().enable();

		Ext.resumeLayouts(true);
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

	onLineEditClick: function() {
		var me = this;

		me.showLineEdit(0);
	},

	showLineEdit: function(row) {
		var me    = this,
			grid  = me.getLineGrid(),
			store = grid.getStore();

		me.getLineMainView().getLayout().setActiveItem(1);
		me.getLineDataView().suspendViewUpdates();

		if (store.getCount()-1 >= row) {
			Ext.defer(function() {
				grid.getPlugin('cellediting').startEditByPosition({ row: row, column: 1 });
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
		var me          = this,
			grid        = me.getLineGrid(),
			store       = grid.getStore(),
			lines       = store.getRange(),
			lineNum     = 1,
			vendorRec   = me.getVendorRecord(),
			propertyRec = me.getPropertyRecord(),
			recData     = {
				property_id    : propertyRec.get('property_id'),
				property_id_alt: propertyRec.get('property_id_alt'),
				property_name  : propertyRec.get('property_name')
			};
		
		// Since we're sorting by line number, let's figure out the max line number to set
		// the value for the new one
		if (lines.length) {
			lineNum = lines[lines.length-1].get(me.itemPrefix + '_linenum') + 1;
		}
		recData[me.itemPrefix + '_linenum'] = lineNum;

		var rec = Ext.create(
			'NP.model.' + me.shortName + '.' + me.controller + 'Item',
			recData
		);

		grid.selectedRec = rec;

		if (me.type == 'invoice' && vendorRec.get('is_utility_vendor') === 1) {
			me.filterUtilityRecords();
		}

		store.add(rec);

		// If appropriate, we need to set the default gl account ID
		var vendor_gl_id = vendorRec.get('glaccount_id'),
			glStore      = grid.glStore;

		// If there's a default GL for the selected vendor, we need to check if
		// it's valid based on the current parameters
		if (vendor_gl_id !== null) {
			// Set the parameters for the GL store
			me.setGlExtraParams();
			// Load the store if parameters have changed
			glStore.loadIfChange(function() {
				// See if the default GL is in the store
				if (glStore.getById(vendor_gl_id) !== null) {
					// Set the default GL on the line
					rec.set({
						glaccount_id    : vendor_gl_id,
						glaccount_number: vendorRec.get('glaccount_number'),
						glaccount_name  : vendorRec.get('glaccount_name')
					});
				}
			});
		}

		grid.getPlugin('cellediting').startEditByPosition({ row: lines.length, column: 1 });
	},

	onLineSaveClick: function() {
		var me          = this,
			cellEditing = me.getLineGrid().getPlugin('cellediting'),
			isValid;

		me.removeBlankLines();

		isValid = me.validateLineItems();

		if (isValid) {
			if (cellEditing.editing) {
				cellEditing.completeEdit();
			}
			me.getLineDataView().resumeViewUpdates();
			me.getLineDataView().refresh();
			me.getLineMainView().getLayout().setActiveItem(0);
		} else {
			NP.Util.showFadingWindow({
				height: 110,
				html  : me.translate('You have one or more invalid line items. See the Line Items grid for details.')
			});
		}

		return isValid;
	},

	/**
	 * Removes any line that's been added (probably as a result of tabbing at the end of another line)
	 * that is blank, meaning hasn't been modified at all (as indicated by the record's "dirty" flag)
	 */
	removeBlankLines: function() {
		var me    = this,
			store = me.getLineGrid().getStore();

		// Loop through all lines in the store
		store.each(function(rec) {
			// If record is new and isn't dirty, assume it's a blank line and remove it
			if (rec.get(me.itemPk) === null && !rec.dirty) {
				store.remove(rec);
			}
		});
	},

	validateHeader: function(isSubmit) {
		var me      = this,
			form    = me.getEntityView(),
			isValid = true;

		Ext.suspendLayouts();

		form.getForm().clearInvalid();

		if (isSubmit) {
			isValid = form.isValid();
		} else {
			isValid = isValid && form.findField('property_id').isValid();
			isValid = isValid && form.findField('vendor_id').isValid();
			isValid = isValid && form.findField(me.longName + '_period').isValid();

			// We'll manually validate dates, that's because we don't want isValid() to return
			// false if the field is blank, but we do if the text in the field is invalid
			Ext.each(form.down('[xtype="datefield"]'), function(field) {
				var val = field.getValue();
				if (val !== null && !Ext.isDate(val)) {
					isValid = isValid && field.isValid();
				}
			});

			// Since we're not calling isValid on the form, we need to manually update our model
			me.getEntityView().updateBoundModels();
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
				var error     = null,
					errorData = {},
					col       = cols[j],
					val       = rec.get(col.dataIndex);

				if (Ext.Array.contains(reqFields, col.dataIndex) && (val === null || val === '' || val === 0)) {
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

					if (NP.Config.getSetting('pn.jobcosting.useRetention', '0') == '1') {
						if (col.dataIndex == 'jbassociation_retamt') {
							var lineAmount = rec.get(me.itemPrefix + '_amount');
							if (lineAmount > 0 && val > lineAmount) {
								error = 'The retention value cannot be greater than the item amount';
							} else if (lineAmount < 0 && val < lineAmount) {
								error = 'The retention value cannot be less than the item amount';
							} else if (lineAmount > 0 && val < 0) {
								error = 'The retention value cannot be less than 0';
							} else if (lineAmount < 0 && val > 0) {
								error = 'The retention value cannot be greater than 0';
							}
						}
					}
				}
				
				if (rec.get('property_id') !== null && col.dataIndex == me.itemPrefix + '_description') {
					var propRec  = me.getStore('property.AllProperties').getById(rec.get('property_id')),
						intPkg   = Ext.getStore('system.IntegrationPackages').getById(propRec.get('integration_package_id')),
						maxLen   = intPkg.get('lineitem_description_max');

					if (rec.get(me.itemPrefix + '_description').length > maxLen) {
						error = 'The description cannot be longer than {maxLength} characters';
						errorData.maxLength = maxLen;
					}
				}

				if (error === null && me.validateLineItem) {
					error = me.validateLineItem(rec, col, val);
				}

				if (error != null) {
					me.showLineEdit(0);

					// We'll use the deferUntil() utility function because in cases where the grid
					// was never shown, the getCell() call will fail until the grid has been fully
					// renderer following the setActiveItem(1) call above
					NP.Util.deferUntil(function markInvalidCells(recInner, colInner, errorInner, errorDataInner) {
						var cellNode = grid.getView().getCell(recInner, colInner);
						cellNode.addCls('grid-invalid-cell');
						cellNode.set({
							'data-qtip': me.translate(errorInner, errorDataInner)
						});
					}, { args: [rec, col, error, errorData] });
					
					valid = false;
				}
			}
		}

		Ext.resumeLayouts(true);

		return valid;
	},

	// TODO: permanently remove this once confirmed this functionality is not needed
	onLineCancelClick: function() {
		var me = this;
		
		me.getLineGrid().getStore().rejectChanges();
	},

	onBeforeLineGridEdit: function(editor, e) {
		var me    = this,
			field = e.column.getEditor(),
			grid  = e.grid,
			data  = null;

		if (me.getEntityRecord().get(me.pk) !== null) {
			data = me.getEntityView().getLoadedData();
		}

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
				|| e.field == me.itemPrefix + '_amount') {
			me.onOpenInvalidSplitField(editor, e.record, field);
		} else if (e.field == me.itemPrefix + '_description') {
			me.onOpenDescriptionEditor(editor, e.grid, e.record, field);
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

		// Set the default readonly state for the field
		var readOnlyState = !(me.getEntityRecord().isLineEditable());
		
		// Check if we're dealing with Modify GL
		if (
			(
				me.getEntityRecord().get(me.longName + '_status') == 'forapproval'
				&& data
				&& data.is_approver
				&& (
					me.shortName == 'invoice' && NP.Security.hasPermission(3001)
					|| me.shortName == 'po' && NP.Security.hasPermission(6005)
				)
			) || (
				me.shortName == 'po'
				&& me.getEntityRecord().get(me.longName + '_status') == 'saved'
                && e.record.get('invoice_id') === null
                && NP.Security.hasPermission(6031)
			)
		) {
			e.record.is_modify_gl = true;
			var editableFields = ['glaccount_id'];
			if (
				me.shortName == 'invoice' && NP.Security.hasPermission(6096)
				|| me.shortName == 'po' && NP.Security.hasPermission(6097)
			) {
				editableFields.push(me.itemPrefix + '_description');
			}

			readOnlyState = !Ext.Array.contains(editableFields, e.field);
		}

		field.setReadOnly(readOnlyState);
	},

	onOpenInvalidSplitField: function(editor, rec, field) {
		var me = this;

		NP.Util.deferUntil(function(recInner, fieldInner) {
			if (recInner.get(me.itemPrefix + '_split') === 1) {
				fieldInner.setReadOnly(true);
			} else {
				fieldInner.setReadOnly(false);
			}
		}, { args: [rec, field] });
	},

	onOpenDescriptionEditor: function(editor, grid, rec, field) {
		var me = this;
		
		me.onOpenInvalidSplitField(editor, rec, field);

		if (rec.get('property_id') !== null) {
			var propRec     = me.getStore('property.AllProperties').getById(rec.get('property_id')),
				intPkgStore = Ext.getStore('system.IntegrationPackages'),
				intPkg      = intPkgStore.getById(propRec.get('integration_package_id'));

			function setMaxLength(field, maxLen) {
				if (!field.getEl()) {
					Ext.defer(function() {
						setMaxLength(field, maxLen);
					}, 100);

					return;
				}

				field.getEl().down('input').set({ maxlength: maxLen });
			}

			setMaxLength(field, intPkg.get('lineitem_description_max'));
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

	onOpenGlAccountEditor: function(editor, grid, rec, field) {
		var me    = this,
			store = grid.glStore;

		me.setGlExtraParams();

		if (store.extraParamsHaveChanged() && grid.selectedRec.get('glaccount_id') !== null) {
			store.removeAll();
			store.add(grid.selectedRec.getData());
		}
	},

	setGlExtraParams: function() {
		var me    = this,
			grid  = me.getLineGrid(),
			store = grid.glStore,
			rec   = grid.selectedRec;

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

	onOpenUnitEditor: function(editor, grid, rec, field) {
		var me          = this,
    		combo       = me.getLineGridUnitCombo(),
    		property_id = rec.get('property_id'),
    		store       = grid.unitStore;

    	me.setUnitExtraParams();

        if (store.extraParamsHaveChanged() && grid.selectedRec.get('unit_id') !== null) {
			store.removeAll();
			store.add(grid.selectedRec.getData());
		}
	},

	setUnitExtraParams: function() {
		var me          = this,
    		grid        = me.getLineGrid(),
    		property_id = grid.selectedRec.get('property_id'),
    		store       = grid.unitStore;

		if (property_id !== null) {
        	store.addExtraParams({ property_id: property_id });
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
                action : 'getJobCodesByFilter',
                status : 'active'
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
            	if (field == 'property_id') {
            		me.onChangeLineProperty();
            	} else if (field == 'glaccount_id') {
            		me.onChangeLineGl();
            	} else if (field == me.itemPrefix + '_amount') {
            		me.onChangeAmount();
            	} else if (field == me.itemPrefix + '_taxflag') {
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
		var me = this;

		Ext.suspendLayouts();

		if (me.getEntityRecord().get(me.pk) !== null) {
			me.buildViewToolbar(me.getEntityView().getLoadedData());
		}

		if (me.query('#entity_tax_amount').length) {
        	me.onChangeShippingTotal();
        }

        Ext.resumeLayouts(true);
    },

	onStoreRemoveLine: function(store, rec, index, isMove) {
		var me = this;

		Ext.suspendLayouts();

		me.buildViewToolbar(me.getEntityView().getLoadedData());
		me.onChangeTaxTotal();
		me.onChangeShippingTotal();

        Ext.resumeLayouts(true);
    },

    // If we edited the property, we need to make sure fields with drop downs that depend
	// on the property are checked and cleared if their value no longer exists in the store
    onChangeLineProperty: function() {
    	var me           = this,
    		grid         = me.getLineGrid(),
    		glaccount_id = grid.selectedRec.get('glaccount_id');

		// If there's a GL Account set in the column, proceed
		if (glaccount_id !== null) {
			// Reload the GL Account store
			me.setGlExtraParams();
			grid.glStore.loadIfChange(function() {
				// If the current grid value doesn't exist in the store, clear it
				if (grid.glStore.getById(glaccount_id) === null) {
					grid.selectedRec.set({
						glaccount_id    : null,
						glaccount_name  : null,
						glaccount_number: null
					});
				}
			});
		}

		// If the property changed, a unit selected under a different property
		// would never be available, so we can just clear it
		grid.selectedRec.set({
			unit_id    : null,
			unit_id_alt: null,
			unit_number: null
		});

		me.recalculateVariance(grid.selectedRec);
    },

    onChangeLineGl: function() {
    	var me = this;

    	me.recalculateVariance(me.getLineGrid().selectedRec);
    },

    recalculateVariance: function(rec) {
    	var me           = this,
    		lineStore    = me.getLineGrid().getStore(),
    		property_id  = rec.get('property_id'),
    		glaccount_id = rec.get('glaccount_id'),
    		period       = me.getEntityView().findField(me.longName + '_period').getValue();

    	// You can't calculate a variance without property or GL selected
    	if (property_id === null || glaccount_id === null) {
    		return;
    	}

    	NP.Net.remoteCall({
    		requests: {
				service     : 'BudgetService',
				action      : 'getMonthlyLineBudgetInfo',
				property_id : rec.get('property_id'),
				glaccount_id: rec.get('glaccount_id'),
				period      : period,
				type        : 'account',
				success     : function(result) {
					var variance = result.month_budget - (result.month_actual + result.month_invoice + result.month_po);

					me.adjustVariances(rec, variance);
				}
			}
    	});
    },

    adjustVariances: function(selRec, variance) {
    	var me        = this,
    		lineStore = me.getLineGrid().getStore(),
    		amtField  = me.itemPrefix + '_amount',
    		lines     = lineStore.queryBy(function(rec) {
	    		if (rec.get('property_id') === selRec.get('property_id') && rec.get('glaccount_id') === selRec.get('glaccount_id')) {
	    			return true;
	    		}
	    		return false;
	    	});

	    Ext.suspendLayouts();

    	// First pass through is to adjust the variance in case there are lines that
		// haven't yet been saved to the DB (new or modified)
		lines.each(function(rec) {
			// If new unsaved line or line with new budget (modified GL or property)
			// decrement its amount from the budget
			if (rec.get(me.itemPk) === null || 'property_id' in rec.modified || 'glaccount_id' in rec.modified) {
				rec.lastModifiedAmt = rec.get(amtField);
				variance -= rec.get(amtField);
			}
			// If existing line with modified amount, adjust the amounts by
			// factoring out the original value and then including the modified one
			else if (amtField in rec.modified) {
				// If this is the first modification, we don't have a lastModifiedAmt property
				// Just use the built-in modified property
				if (!rec.lastModifiedAmt) {
					rec.lastModifiedAmt = rec.modified[amtField];
				}
				// Decrement the last amount from the variance to get this line basically out
				// of the occasion
				variance += rec.lastModifiedAmt;
				// Store the new amount as the last modified so that it can be used next time
				// this function runs
				rec.lastModifiedAmt = rec.get(amtField);

				// Factor in the new amount into the variance
				variance -= rec.get(amtField);
			}
		});

		// Second pass is to update the variance on all lines
		lines.each(function(rec) {
			rec.set('budget_variance', variance)
		});

		me.setRequiredNotes();

		Ext.resumeLayouts(true);
    },

	onChangeTaxTotal: function() {
		var me           = this,
			store        = me.getLineGrid().getStore();

		if (store.getCount()) {
			var tpl          = me.getLineDataView().tpl,
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
		}
	},

	onChangeShippingTotal: function() {
		var me        = this,
			store     = me.getLineGrid().getStore();
		
		if (store.getCount()) {
			var tpl       = me.getLineDataView().tpl,
				total     = tpl.getSum(me.itemPrefix + '_amount'),
				totalShip = me.getShippingField().getValue();

			store.each(function(rec) {
				var amount = rec.get(me.itemPrefix + '_amount');
				rec.set(me.itemPrefix + '_shipping', (amount / total) * totalShip);
			});

			tpl.updateTotals();
		}
	},

	onChangeQuantity: function(grid, field) {
		var me        = this,
			rec       = me.getLineGrid().selectedRec,
			unitPrice = rec.get(me.itemPrefix + '_unitprice'),
			qty       = field.getValue();

		rec.set(me.itemPrefix + '_amount', qty * unitPrice);
		me.adjustVariances(rec, rec.get('budget_variance'));
	},

	onChangeUnitPrice: function(grid, field) {
		var me        = this,
			qty       = grid.selectedRec.get(me.itemPrefix + '_quantity'),
			unitPrice = field.getValue();

		grid.selectedRec.set(me.itemPrefix + '_amount', qty * unitPrice);
	},

	onChangeAmount: function() {
		var me     = this,
			rec    = me.getLineGrid().selectedRec,
			qty    = rec.get(me.itemPrefix + '_quantity'),
			amount = rec.get(me.itemPrefix + '_amount');

		rec.set(me.itemPrefix + '_unitprice', amount / qty);

		me.adjustVariances(rec, rec.get('budget_variance'));
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

	loadImage: function() {
		var me           = this,
			data         = me.getEntityView().getLoadedData(),
            user         = NP.Security.getUser(),
            hideImg      = user.get('userprofile_splitscreen_LoadWithoutImage'),
            splitSize    = user.get('userprofile_splitscreen_size'),
            imageRegion  = me.getImageRegion(),
            showImage    = false,
            sizeProp,
            imagePanel,
            iframeId,
            iframeEl;

        if (!splitSize) {
        	splitSize = 50;
        }

		if (data['image'] !== null) {
			if (Ext.Array.contains(['north','south'], imageRegion)) {
				sizeProp = 'height';
			} else {
				sizeProp = 'width';
			}
	        imagePanel = me.getImagePanel();
	        imagePanel.show();
	        
	        iframeId = me.shortName + '-image-iframe-' + imageRegion;
			iframeEl = Ext.get(iframeId);

			if (!iframeEl) {
				imagePanel[sizeProp] = splitSize + '%';
				
				imagePanel.update('<iframe id="' + iframeId + '" src="about:blank" height="100%" width="100%"></iframe>');
				iframeEl = Ext.get(iframeId);
		    }

		    if ( (!('showEntityImage' in me) && !hideImg) || me.showEntityImage ) {
	        	imagePanel.expand(false);
	        	showImage = true;
	        }

		    if (showImage) {
		    	var src = 'showImage.php?image_index_id=' + data['image']['Image_Index_Id'];
		    	if (iframeEl.dom.src != src) {
					iframeEl.dom.src = src;
				}
			}

			me.showEntityImage = showImage;
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

	showUnexpectedError: function() {
		var me = this;

		Ext.MessageBox.alert(
			me.translate('Error'),
			me.translate('An unexpected error occurred. Please try again.')
		);
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
		var me         = this,
			lineStore  = me.getLineDataView().getStore(),
			taxField   = me.query('#entity_tax_amount', true),
			currentTax = taxField.getValue(),
			taxable    = lineRec.get(me.itemPrefix + '_taxflag');

		lineStore.remove(lineRec);

		if (taxable == 'Y') {
			taxField.setValue((currentTax - lineRec.get(me.itemPrefix + '_salestax')).toFixed(2));
		}
	},

	onEditLineClick: function(lineRec) {
		var me  = this,
			row = me.getLineGrid().getStore().indexOf(lineRec);

		me.showLineEdit(row);
	},

	onPoRefClick: function(rec) {
		var me = this;
		me.addHistory('Po:showView:' + rec.get('purchaseorder_id'));
	},

	onInvoiceRefClick: function(rec) {
		var me = this;
		me.addHistory('Invoice:showView:' + rec.get('invoice_id'));
	},

	onReceiptRefClick: function(rec) {
		var me = this;
		me.addHistory('Receipt:showView:' + rec.get('receipt_id'));
	},

	onCancelLine: function(rec) {
		var me = this;

		NP.Net.remoteCall({
			method  : 'POST',
    		mask    : me.getLineView(),
			requests: {
				service  : me.service,
				action   : 'cancelLine',
				poitem_id: rec.get('poitem_id'),
				success  : function(result) {
					if (result.success) {
						if (result['purchaseorder_status'] != me.getEntityRecord().get('purchaseorder_status')) {
							me.showView(me.getEntityRecord().get(me.pk));
						} else {
							me.updateEntityViewState({ toolbar: true, lines: true }, true);
						}
					} else {
						me.showUnexpectedError();
					}
				}
			}
		});
	},

	onRestoreLine: function(rec) {
		var me = this;

		NP.Net.remoteCall({
    		method  : 'POST',
    		mask    : me.getLineView(),
			requests: {
				service  : me.service,
				action   : 'restoreLine',
				poitem_id: rec.get('poitem_id'),
				success  : function(result) {
					if (result.success) {
						if (result['purchaseorder_status'] != me.getEntityRecord().get('purchaseorder_status')) {
							me.showView(me.getEntityRecord().get(me.pk));
						} else {
							me.updateEntityViewState({ toolbar: true, lines: true, historyLog: true }, true);
						}
					} else {
						me.showUnexpectedError();
					}
				}
			}
		});
	},

	onSplitLineClick: function(lineRec) {
		var me              = this,
			vendorsite_id   = me.getVendorRecord().get('vendorsite_id'),
			win             = Ext.create('NP.view.shared.invoicepo.SplitWindow', {
								type: me.shortName
							});

		this.getLineDataView().suspendViewUpdates();

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
				newRec.openLineInternalId = lineRec.internalId;
				splitStore.add(newRec);
			} else {
				var splitRecs = me.getSplitLines(me.openSplitLineRec),
					totalQty  = 0,
					newRec;

				splitRecs.each(function(splitRec) {
					totalQty += splitRec.get(me.itemPrefix + '_quantity');
				});

				win.down('#splitTotalQty').setValue(totalQty);

				splitRecs.each(function(splitRec) {
					newRec = splitRec.copy();
					newRec.openLineInternalId = splitRec.internalId;
					splitStore.add(newRec);
				});
			}

			me.getSplitGrid().getPlugin('cellediting').startEditByPosition({ row: 0, column: 1 });
		});
	},

	getSplitLines: function(rec) {
		var me         = this,
			lineStore  = me.query('#' + me.shortName + 'LineGrid', true).getStore(),
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
		var me   = this,
			grid = me.getSplitGrid(),
			rec  = me.openSplitLineRec.copy();

		rec.set(me.itemPk, null);

		grid.getStore().add(rec);
		me.onRecalculateSplit();
		rec.commit();
		grid.getPlugin('cellediting').startEditByPosition({ row: grid.getStore().getCount()-1, column: 1 });
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

		// Validate the allocated amount (allow differences below the max decimal precision that we allow)
		if (allocLeft >= 0.000001 || allocLeft <= -0.000001) {
			Ext.MessageBox.alert(
				me.translate('Error'),
				me.translate('You have allocated too little or too much money.')
			);
		} else {
			var splitStore   = me.getSplitGrid().getStore(),
				totalRecs    = splitStore.getCount(),
				lineDataView = me.getLineDataView(),
				lineStore    = me.query('#' + me.shortName + 'LineGrid', true).getStore(),
				desc         = Ext.ComponentQuery.query('#splitDescription')[0].getValue(),
				rec,
				lineRec,
				i;

			Ext.suspendLayouts();

			// If dealing with a new split, we need to check if the record we originally split
			// is still there
			if (me.isNewSplit) {
				rec = splitStore.findBy(function(innerRec) {
					if (innerRec.openLineInternalId == me.openSplitLineRec.internalId) {
						return true;
					}
					return false;
				});

				if (rec === -1) {
					lineStore.remove(me.openSplitLineRec);
				}
			// When editing a split, we need to loop through the original lines and see
			// if they still exist in the line store, if they don't we remove them
			} else {
				var oldRecs = me.getSplitLines(me.openSplitLineRec);

				oldRecs.each(function(lineRec) {
					rec = splitStore.findBy(function(innerRec) {
						if (innerRec.openLineInternalId == lineRec.internalId) {
							return true;
						}
						return false;
					});
					
					if (rec === -1) {
						lineStore.remove(lineRec);
					}
				});
			}
			
			// Clear the open split recorc
			me.openSplitLineRec = null;

			// Loop through all the records in the split grid
			for (i=0; i<totalRecs; i++) {
				lineRec = null;
				rec = splitStore.getAt(i);
				
				// Look for the split grid record in the line grid
				if (rec.openLineInternalId) {
					lineRec = lineStore.getByInternalId(rec.openLineInternalId);
				}

				// If the record exists, we want to update it
				if (lineRec) {
					var data = rec.getData();
					data[me.itemPrefix + '_description'] = desc;
					data[me.itemPrefix + '_split'] = 1;
					lineRec.set(data);
				// Otherwise, we want to add a new record to the line grid
				} else {
					rec.set(me.itemPrefix + '_description', desc);
					rec.set(me.itemPrefix + '_split', 1);
					lineStore.add(rec);
				}
			}

			// Refresh the data view
			lineDataView.refresh();

			Ext.resumeLayouts(true);

			// Close the window now that we've processed everything
			me.getSplitWindow().close();
		}
	},

	onCloseSplitWindow: function() {
		this.getLineDataView().resumeViewUpdates();
		this.getLineDataView().refresh();
	},

	onSaveEntity: function(callback) {
		var me      = this,
			invoice = me.getEntityRecord();

		// Before saving, make sure invoice hasn't been updated
		me.saveEntity(
			me.service,
			'saveEntity',
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
						me.getLineGrid().getStore().commitChanges();

						// TODO: need to account for UI changes that may be required on a save
					}
				}
			}
		);
	},

	saveEntity: function(service, action, extraParams, validateAll, callback) {
		var me   = this,
			form = me.getEntityView();

		if (me.onLineSaveClick() && me.validateHeader(validateAll)) {
			// Before saving, make sure entity hasn't been updated
			me.checkLock(function() {
				// Get the line items that need to be saved
				var lines            = me.convertLinesToSubmit(),
					serviceFieldData = {},
					tax_amount,
					shipping_amount;

				if (me.query('#entity_tax_amount').length) {
					tax_amount = me.query('#entity_tax_amount', true).getValue();
					shipping_amount = me.query('#entity_shipping_amount', true).getValue();
				} else {
					tax_amount = 0;
					shipping_amount = 0;
				}

				// If dealing with a PO, get service field data
				if (me.shortName == 'po') {
					var serviceFields = form.query('[isServiceField=1]'),
						val;

					Ext.each(serviceFields, function(serviceField) {
						serviceFieldData[serviceField.name] = serviceField.getSubmitValue();
					});
				}

				// Form is valid so submit it using the bound model
				form.submitWithBindings({
					service: service,
					action : action,
					extraParams: Ext.apply(extraParams, {
						userprofile_id              : NP.Security.getUser().get('userprofile_id'),
						delegation_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
						lines                       : lines,
						tax                         : tax_amount,
						shipping                    : shipping_amount,
						service_fields              : serviceFieldData
					}),
					extraFields: {
						vendor_id: 'vendor_id'
					},
					success: function(result) {
						me.getEntityRecord().set('lock_id', result.lock_id);

						me.buildViewToolbar(form.getLoadedData());

						callback(result);
					}
				});
			});
		}
	},

	convertLinesToSubmit: function() {
		var me    = this,
			lines = me.getLineGrid().getStore().getRange(),
			data  = [],
			i;
		
		for (i=0; i<lines.length; i++) {
			var rec = lines[i].getData();
			rec.is_dirty     = lines[i].dirty;
			rec.is_modify_gl = (lines[i].is_modify_gl) ? true : false;

			data.push(rec);
		}

		return data;
	},

	onDeleteEntity: function() {
		var me          = this,
			entity_id   = me.getEntityRecord().get(me.pk),
			form        = me.getEntityView(),
			data        = form.getLoadedData(),
			dialogTitle = me.translate('Delete ' + me.displayName + '?'),
			dialogText  = me.translate('Are you sure you want to delete this ' + me.displayName + '?');

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
						service  : me.service,
						action   : 'deleteEntity',
						// Params
						entity_id: entity_id,
						// Callback
						success  : function(result) {
							if (result.success) {
								NP.Util.showFadingWindow({
									html: me.translate('The ' + me.displayName + ' has been deleted')
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
						if (result.success) {
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
						} else {
							me.showUnexpectedError();
						}
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

        var win = Ext.create('NP.view.shared.invoicepo.UseTemplateWindow', {
            itemId               : me.shortName + 'ApplyTemplateWin',
            type                 : me.shortName,
            property_id          : property_id,
            vendorsite_id        : vendorsite_id
        });

        win.show();
	},

    onApplyTemplateSave: function(win, template_id) {
        var me         = this,
        	entity_id  = me.getEntityRecord().get(me.pk);

        me.checkLock(function() {
        	NP.Net.remoteCall({
        		method  : 'POST',
        		mask    : me.getEntityView(),
        		requests: {
					service    : me.service,
					action     : 'applyTemplate',
					entity_id  : entity_id,
					template_id: template_id,
					success    : function(result) {
						if (result.success) {
							// Show notification
							NP.Util.showFadingWindow({
								html: me.translate('The template was successfully applied')
							});

							// Refresh the invoice
							me.showView(entity_id);

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

    onUseTemplate: function() {
    	var me = this;

		NP.Net.remoteCall({
			method  : 'POST',
			mask    : me.getEntityView(),
			requests: {
				service  : me.service,
				action   : 'useTemplate',
				entity_id: me.getEntityRecord().get(me.pk),
				success  : function(result) {
					if (result.success) {
						NP.Util.showFadingWindow({ html: NP.Translator.translate('New ' + me.displayName + ' created from template') });

						me.addHistory(me.controller + ':showView:' + result.entity_id);
					} else {
						me.showUnexpectedError();
					}
				}
			}
		});
    },

    onSubmitForPayment: function() {
    	var me         = this,
        	invoice_id = me.getEntityRecord().get(me.pk);

        me.onSaveEntity(function(result) {
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
			type  : this.shortName
    	});

    	win.show();
    },

    onRejectSave: function() {
    	var me            = this,
    		win           = me.getCmp('shared.invoicepo.rejectwindow'),
    		form          = win.down('form'),
    		entity_id     = me.getEntityRecord().get(me.pk),
    		reasonField   = win.down('[name="rejectionnote_id"]'),
			noteField     = win.down('[name="reject_note"]');

    	if (form.isValid()) {
    		me.checkLock(function() {
	    		NP.Net.remoteCall({
					method  : 'POST',
					mask    : form,
					requests: {
						service            : 'WFRuleService',
						action             : 'reject',
						table_name         : me.longName,
						tablekey_id        : entity_id,
						rejectionnote_id   : reasonField.getValue(),
						reject_note        : noteField.getValue(),
						success            : function(result) {
							if (result.success) {
								NP.Util.showFadingWindow({
									html: me.translate('The ' + me.displayName + ' has been rejected')
								});

								Ext.suspendLayouts();

								me.showView(entity_id);

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

    onSaveAsTemplate: function(isUser) {
    	var me       = this,
    		formData = me.getEntityView().getLoadedData(),
    		title    = (isUser) ? 'Save as User Template' : 'Save as Template',
    		win;

    	title = NP.Translator.translate(title);

    	win = Ext.create('NP.view.shared.invoicepo.TemplateWindow', {
			itemId          : me.shortName + 'SaveTemplateWin',
			title           : title,
			type            : me.shortName,
			status          : me.getEntityRecord().get(me.longName + '_status'),
			isUser          : isUser,
			showImageOptions: (formData['image'] !== null)
        });

        win.show();
    },

    onSaveAsTemplateSave: function() {
    	var me             = this,
			win            = me.getCmp('shared.invoicepo.templatewindow'),
			include_images = win.down('radiogroup');

    	me.saveFromTemplateWindow('draft', function(result) {
    		NP.Util.showFadingWindow({ html: NP.Translator.translate('Template has been saved') });
    	});
    },

    onCreateCopy: function() {
    	var me       = this,
    		formData = me.getEntityView().getLoadedData();

    	var win = Ext.create('NP.view.shared.invoicepo.TemplateWindow', {
			itemId          : me.shortName + 'CopyTemplateWin',
			title           : 'Create Copy',
			type            : me.shortName,
			status          : me.getEntityRecord().get(me.longName + '_status'),
			showImageOptions: (formData['image'] !== null)
        });

        win.show();
    },

    onSaveCopy: function() {
		var me             = this,
			win            = me.getCmp('shared.invoicepo.templatewindow'),
			include_images = win.down('radiogroup');

    	me.saveFromTemplateWindow(null, function(result) {
    		NP.Util.showFadingWindow({ html: NP.Translator.translate('Template copy has been saved') });
    	});
    },

    saveFromTemplateWindow: function(status, callback) {
    	var me   = this,
			win  = me.getCmp('shared.invoicepo.templatewindow'),
			form = win.down('form').getForm();

		if (form.isValid()) {
			var include_images      = win.down('radiogroup'),
				save_invoice_number = form.findField('save_invoice_number');

			if (include_images) {
				include_images = include_images.getValue().include_images;
			}
			
			NP.Net.remoteCall({
				method  : 'POST',
				mask    : win,
				requests: {
					service            : me.service,
					action             : 'saveCopy',
					template_name      : form.findField('template_name').getValue(),
					entity_id          : me.getEntityRecord().get(me.pk),
					include_images     : (include_images == 'saveWith' || include_images == 'saveWithAndContinue'),
					save_invoice_number: (save_invoice_number) ? save_invoice_number.getValue() : false,
					isUser             : win.isUser,
					status             : status,
					success            : function(result) {
						if (result.success) {
							win.close();

							if (include_images === 'saveWith' || include_images === 'saveWithout') {
								me.addHistory(me.controller + ':showView:' + result.entity_id);
							}

							callback(result);
						} else {
							me.showUnexpectedError();
						}
					}
				}
			});
		}
    },

    onCreateSchedule: function() {
    	var me       = this,
    		formData = me.getEntityView().getLoadedData(),
    		formCfg  = {
            	bind: {
			    	models: ['system.RecurringScheduler']
			    }
            };
        
        if (formData['schedule_exists']) {
        	Ext.apply(formCfg.bind, {
				service    : me.service,
				action     : 'getSchedule',
				extraParams: { entity_id: me.getEntityRecord().get(me.pk) }
			});

			Ext.apply(formCfg, {
				listeners      : {
					dataloaded: function(boundForm, data) {
						var days    = data['schedule_week_days'],
							newDays = [];

						if (days !== null) {
							days = days.split(',');
						}
						Ext.Array.each(days, function(day) {
							newDays.push(parseInt(day));
						});

						boundForm.findField('schedule_week_days_group').setValue({ schedule_week_days: newDays });

						// Show the delete button when a schedule exists
						boundForm.down('#' + me.shortName + 'ScheduleDeleteBtn').show();
					}
				}
			});
        }

        var win = Ext.create('NP.view.shared.invoicepo.ScheduleWindow', {
			itemId : me.shortName + 'ScheduleWin',
			type   : me.shortName,
			formCfg: formCfg
        });

        win.show();
    },

    onDeleteSchedule: function() {
    	var me          = this,
    		dialogTitle = NP.Translator.translate('Delete Schedule?')
    		dialogText  = NP.Translator.translate('Are you sure you want to delete this schedule?'),
    		formData    = me.getEntityView().getLoadedData();

    	Ext.MessageBox.confirm(dialogTitle, dialogText, function(btn) {
			// If user clicks Yes, proceed with deleting
			if (btn == 'yes') {
				NP.Net.remoteCall({
					requests: {
						service  : 'InvoiceService',
						action   : 'deleteSchedule',
						entity_id: me.getEntityRecord().get(me.pk),
						success: function(result) {
							if (result.success) {
								NP.Util.showFadingWindow({ html: NP.Translator.translate('Schedule was deleted') });

								me.getCmp('shared.invoicepo.schedulewindow').close();
								formData.schedule_exists = false;
								me.buildViewToolbar(formData);
							} else {
								me.showUnexpectedError();
							}
						}
					}
				});
			}
		});
    },

    onSaveSchedule: function() {
    	var me       = this,
			win      = me.getCmp('shared.invoicepo.schedulewindow'),
			form     = win.down('boundform'),
    		data     = me.getEntityView().getLoadedData(),
    		weekDays;

		if (win.isValid()) {
			weekDays = form.findField('schedule_week_days_group').getValue()
			if (weekDays.schedule_week_days) {
				weekDays = weekDays.schedule_week_days;

				if (Ext.isArray(weekDays)) {
					weekDays = weekDays.join(',');
				} else {
					weekDays = weekDays+'';
				}
			} else {
				weekDays = null;
			}

			// Form is valid so submit it using the bound model
			form.submitWithBindings({
				service: me.service,
				action : 'saveSchedule',
				extraParams: {
					entity_id         : me.getEntityRecord().get(me.pk),
					schedule_week_days: weekDays
				},
				success: function(result) {
					if (result.success) {
						NP.Util.showFadingWindow({ html: NP.Translator.translate('Schedule was saved') });

						data.schedule_exists = true;
						me.buildViewToolbar(data);

						win.close();
					} else {
						me.showUnexpectedError();
					}
				}
			});
		}
    },

    onChangeProperty: function() {
    	var me  = this,
			win = Ext.create('NP.view.shared.invoicepo.ChangePropertyWindow', {
					itemId: me.shortName + 'ChangePropertyWindow',
					type  : me.shortName,
					store : me.getPropertyCombo().getStore()
				});

		win.down('customcombo').setDefaultRec(me.getPropertyRecord())

		win.show();
    },

    onChangePropertySave: function() {
    	var me          = this,
    		win         = me.getCmp('shared.invoicepo.changepropertywindow'),
    		entity_id   = me.getEntityRecord().get(me.pk),
    		property_id = win.down('customcombo').getValue(),
    		msg;

    	// Only process if property selected is different from current property on entity
    	if (property_id != me.getPropertyRecord().get('property_id')) {
    		// Run the backend process to update the property
    		NP.Net.remoteCall({
    			method  : 'POST',
    			mask    : win,
    			requests: {
					service    : me.service,
					action     : 'changeProperty',
					entity_id  : me.getEntityRecord().get(me.pk),
					property_id: property_id,
					success    : function(result) {
						if (result.success) {
							// Check if there were invalid lines
							if (result.invalidLines) {
								msg = 'Some line item ' + NP.Config.getPropertyLabel(true) + ' were not updated ' +
										'due to invalid GL to ' + NP.Config.getPropertyLabel() + ' Associations.';
				    		} else {
				    			msg = NP.Config.getPropertyLabel() + ' has been successfully changed';
				    		}

				    		// Show status message
				    		NP.Util.showFadingWindow({
								height: 110,
								html  : msg
							});

							// Close the window
				    		win.close();

				    		// Refresh the entity
				    		me.showView(entity_id);
				    	} else {
				    		me.showUnexpectedError();
				    	}
    				}
    			}
    		});
    	} else {
    		win.close();
    	}
    },

    onShowAuditTrail: function() {
    	var me    = this,
    		btn   = me.query('#' + me.shortName + 'showAuditTrailBtn', true),
    		store = me.getHistoryLogGrid().getStore(),
    		text  = (btn.showAudit) ? 'Hide' : 'Show',
    		showAudit;

    	store.addExtraParams({ showAudit: btn.showAudit });
    	store.load();

    	text += ' Audit Trail';
    	btn.setText(NP.Translator.translate(text));

    	btn.showAudit = (btn.showAudit) ? 0 : 1;
    },

    onShowHistoryDetail: function(rec) {
    	var me = this,
			win;

		NP.Net.remoteCall({
			requests: {
				service   : me.service,
				action    : 'getHistoryLogDetail',
				approve_id: rec.get('approve_id'),
				entity_id : me.getEntityRecord().get(me.pk),
				success   : function(result) {
					win = Ext.create('NP.view.shared.invoicepo.HistoryDetailWindow', {
						detailData: result
					});

					win.show();
				}
			}
		});
    },

    onShowBudgetDetail: function(rec, type) {
    	var me  = this,
    		win = Ext.create('NP.view.shared.invoicepo.BudgetDetailWindow', {
    			itemId    : me.shortName + 'BudgetDetailWindow',
    			rec       : rec,
    			showYearly: (NP.Config.getSetting('PN.Budget.DisplayAnnual', '0') == 1)
    		});

    	type = type || 'account';

    	win.show();

    	me.loadBudgetDetails(rec, type);
    },

	onViewBudgetDetailsBy: function(btn) {
		var me   = this,
    		win  = me.getCmp('shared.invoicepo.budgetdetailwindow');

		btn.type = (btn.type == 'account') ? 'category' : 'account';

		me.loadBudgetDetails(win.rec, btn.type);
	},

    loadBudgetDetails: function(rec, type) {
    	var me          = this,
    		win         = me.getCmp('shared.invoicepo.budgetdetailwindow'),
    		period      = me.getEntityView().findField(me.longName + '_period').getValue(),
    		includeYear = (NP.Config.getSetting('PN.Budget.DisplayAnnual', '0') == 1),
    		amtField    = me.itemPrefix + '_amount',
    		reqs;
		
    	type = type || 'account';

    	reqs = [{
			service     : 'BudgetService',
			action      : 'getMonthlyLineBudgetInfo',
			property_id : rec.get('property_id'),
			glaccount_id: rec.get('glaccount_id'),
			period      : period,
			type        : type
		}];

		if (includeYear) {
			reqs.push({
				service     : 'BudgetService',
				action      : 'getYearlyLineBudgetInfo',
				property_id : rec.get('property_id'),
				glaccount_id: rec.get('glaccount_id'),
				period      : period,
				type        : type
			});
		}

    	NP.Net.remoteCall({
    		mask    : win,
			requests: reqs,
			success : function(results) {
				var budgetInfo = results[0];
				if (includeYear) {
					Ext.apply(budgetInfo, results[1]);
				}

				budgetInfo.gl_label = (type == 'account') ? 'Code' : 'Category';

				// We need to add invoices that aren't yet in the database or have been changed
				var lineStore = me.getLineGrid().getStore();
				
				lineStore.each(function(lineRec) {
					if (
						rec.get('property_id') === lineRec.get('property_id')
						&& rec.get('glaccount_id') === lineRec.get('glaccount_id')
					) {
						if (lineRec.get(me.itemPk) === null || 'property_id' in lineRec.modified || 'glaccount_id' in lineRec.modified) {
							budgetInfo['month_' + me.shortName] += lineRec.get(me.itemPrefix + '_amount');
							if (includeYear) {
								budgetInfo['year_' + me.shortName] += lineRec.get(me.itemPrefix + '_amount');
							}
						} else if (amtField in lineRec.modified) {
							budgetInfo['month_' + me.shortName] -= lineRec.modified[amtField];
							budgetInfo['month_' + me.shortName] += lineRec.get(amtField);
							if (includeYear) {
								budgetInfo['year_' + me.shortName] -= lineRec.modified[amtField];
								budgetInfo['year_' + me.shortName] += lineRec.get(amtField);
							}
						}
					}
				});

				win.updateContent(budgetInfo);
			}
		});
    },

	onForward: function(isVendorFwd) {
		var me    = this,
	        email = NP.Security.getUser().get('email_address');

		if (!Ext.isEmpty(email)) {
			var win = Ext.widget(me.shortName + '.forwardwindow', {
				itemId     : me.shortName + 'ForwardWin',
				entity     : me.getEntityRecord(),
				vendor     : me.getVendorRecord(),
				isVendorFwd: isVendorFwd
	        });

        	win.show();
        } else {
        	Ext.MessageBox.alert(
				me.translate('Error'),
				me.translate('You cannot forward invoices without a valid email address. ' +
								'Please update your profile with an email address.')
			);
        }
	},

	onForwardSend: function() {
		var me   = this,
			win  = me.getCmp(me.shortName + '.forwardwindow'),
			form = win.down('form').getForm();

		if (win.isValid()) {
			NP.Net.remoteCall({
				mask    : win,
				method  : 'POST',
				requests: {
					service      : me.service,
					action       : 'forwardEntity',
					entity_id    : win.entity.get(me.pk),
					sender_email : NP.Security.getUser().get('email_address'),
					forward_to   : win.getForwardTo(),
					forward_val  : win.getForwardValue(),
					message      : form.findField('message').getValue(),
					includes     : win.getIncludes(),
					success      : function(result) {
						if (result.success) {
							if (result.errors.length) {
								Ext.MessageBox.alert(
									me.translate('Error'),
									me.translate(me.displayName + ' could not be forwarded to the following recipients:<br /><br />') +
									result.errors.join(',')
								);
							} else {
								NP.Util.showFadingWindow({
									html: me.translate(me.displayName + ' was successfully forwarded.')
								});
								win.close();
							}
							me.getForwardsGrid().getStore().load();
						} else {
							Ext.MessageBox.alert(
								me.translate('Error'),
								me.translate(result.error)
							);
						}
					}
				}
			});
		}
	},

	onReadyForProcessing: function() {
		var me      = this,
			data    = me.getEntityView().getLoadedData(),
			buttons = [],
			msg,
			releaseText,
			dialog;

		// First, validate and save the entity
		me.saveEntity(
			me.service,
			'saveEntity',
			{},
			true,
			function(result) {
				// Check what can be done with the entity by the current user
				NP.Net.remoteCall({
					mask    : me.getEntityView(),
					requests: {
						service    : 'WFRuleService',
						action     : 'requiresApproval',
						table_name : me.longName,
						tablekey_id: me.getEntityRecord().get(me.pk),
						success    : function(result) {
							// If entity requires approval, do this
							if (result) {
								// Set the message to display
								msg = NP.Translator.translate('This ' + me.displayName + ' requires approval.');

								// Set the buttons to show
								buttons.push(
									{
										itemId: me.shortName + 'SubmitForApprovalBtn',
										text  : NP.Translator.translate('Submit For Approval')
									}
									// TODO: add and next functionality when appropriate
									/*,{
										itemId: me.shortName + 'SubmitForApprovalAndNextBtn',
										text  : NP.Translator.translate('Submit For Approval and Next')
									}*/
								);

								if (data['has_optional_rule']) {
									buttons.push({
										itemId: me.shortName + 'SubmitAndRouteBtn',
										text  : NP.Translator.translate('Submit and Route Manually')
									});
								}
							}
							// If approval is not needed, do this
							else {
								// Set the message to display
								msg = NP.Translator.translate('This ' + me.displayName + ' does not require approval.');

								if (me.shortName == 'po') {
									releaseText = 'Release';

									// Set the buttons to show
									buttons.push(
										{
											itemId: me.shortName + 'ReleaseBtn',
											text  : NP.Translator.translate(releaseText)
										}
										// TODO: add and next functionality when appropriate
										/*,{
											itemId: me.shortName + 'ReleaseAndNextBtn',
											text  : NP.Translator.translate(releaseText + ' and Next')
										}*/
									);
								} else if (me.shortName == 'invoice') {
									var lineDataView = me.getLineDataView();
									if (lineDataView.tpl.getNetAmount() < 0) {
										releaseText = 'Credit';
									} else {
										releaseText = 'Payment';
									}

									if (NP.Config.getSetting('PN.InvoiceOptions.SKIPSAVE', '0') == 1) {
										// Set the buttons to show
										buttons.push(
											{
												itemId: me.shortName + 'SubmitForPaymentBtn',
												text  : NP.Translator.translate('Submit For ' + releaseText)
											}
											// TODO: add and next functionality when appropriate
											/*,{
												itemId: me.shortName + 'SubmitForPaymentAndNextBtn',
												text  : NP.Translator.translate('Submit For ' + releaseText + ' and Next')
											}*/
										);
									} else {
										// Set the buttons to show
										buttons.push(
											{
												itemId: me.shortName + 'ProcessBtn',
												text  : NP.Translator.translate('Process ' + releaseText)
											}
											// TODO: add and next functionality when appropriate
											/*,{
												itemId: me.shortName + 'ProcessAndNextBtn',
												text  : NP.Translator.translate('Process ' + releaseText + ' and Next')
											}*/
										);
									}
								}

								if (data['has_optional_rule']) {
									buttons.push({
										itemId: me.shortName + 'RouteBtn',
										text  : NP.Translator.translate('Route Manually')
									});
								}
							}

							msg += '<br /><br />' + NP.Translator.translate('You now have the following options:');

							var dialog = Ext.create('Ext.window.MessageBox', {
								itemId: 'readyForProcessingDlg',
								buttons    : buttons,
								buttonAlign: 'center'
							});

							dialog.show({
								title : NP.Translator.translate('Processing'),
								width : 480,
								msg   : msg
							});
						}
					}
				});
			}
		);
	},

	onSubmitForApproval: function(andNext) {
		var me = this,
			id = me.getEntityRecord().get(me.pk);

		// Release the PO
		NP.Net.remoteCall({
			method  : 'POST',
			mask    : me.getEntityView(),
			requests: {
				service    : 'WFRuleService',
				action     : 'submitForApproval',
				table_name : me.longName,
				tablekey_id: id,
				success    : function(result) {
					if (result.success) {
						Ext.ComponentQuery.query('#readyForProcessingDlg')[0].destroy();
						me.showView(id);
					} else {
						me.showUnexpectedError();
					}
				}
			}
		});
	},

	onSubmitAndRoute: function() {
		var me = this;

		me.showRouteWindow('submit');
	},

	onRoute: function() {
		var me = this;

		me.showRouteWindow('route');
	},

	showRouteWindow: function(action) {
		var me  = this,
			win = Ext.create('NP.view.shared.invoicepo.RouteWindow', {
					itemId     : me.shortName + 'RouteWindow',
					type       : me.shortName,
					property_id: me.getPropertyRecord().get('property_id'),
					action     : action
				});

		win.show();
	},

	onRouteSave: function() {
		var me        = this,
			entity_id = me.getEntityRecord().get(me.pk),
			win       = me.getCmp('shared.invoicepo.routewindow'),
			msgBox    = me.query('#readyForProcessingDlg', true),
			action    = (win.action == 'route') ? 'route' : 'submitForApprovalAndRoute';

		if (win.isValid()) {
			NP.Net.remoteCall({
				mask    : win,
				method  : 'POST',
				requests: {
					service    : 'WFRuleService',
					action     : action,
					table_name : me.longName,
					tablekey_id: entity_id,
					users      : win.getSelectedUsers(),
					success    : function(result) {
						if (result.success) {
							win.close();
							msgBox.destroy();

							NP.Util.showFadingWindow({
								html  : me.translate(me.displayName + ' has been routed for approval.')
							});

							me.showView(entity_id);
						} else {
							me.showUnexpectedError();
						}
					}
				}
			});
		}
	},

	onApprove: function() {
		var me = this,
			id = me.getEntityRecord().get(me.pk);

		NP.Net.remoteCall({
			method  : 'POST',
			mask    : me.getEntityView(),
			requests: {
				service    : 'WFRuleService',
				action     : 'approve',
				table_name : me.longName,
				tablekey_id: id,
				success    : function(result) {
					if (result.success) {
						me.showView(id);
					} else {
						me.showUnexpectedError();
					}
				}
			}
		});
	},

	onSelectTaxable: function(combo, recs) {
		var me         = this,
			taxable    = false,
			taxField   = me.query('#entity_tax_amount', true),
			currentTax = taxField.getValue(),
			lineRec    = me.getLineGrid().selectedRec,
			taxAmount  = lineRec.get('property_salestax') * lineRec.get(me.itemPrefix + '_amount');

		if (recs.length && recs[0].get('value') == 'Y') {
			taxField.setValue((currentTax + taxAmount).toFixed(2));
		} else {
			taxField.setValue((currentTax - taxAmount).toFixed(2));
		}
	}
});