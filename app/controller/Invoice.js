/**
 * The Invoice controller deals with operations in the Invoice section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.Invoice', {
	extend: 'NP.controller.AbstractEntityController',
	
	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security',
		'NP.lib.core.Net',
		'NP.lib.core.Translator',
		'NP.lib.core.Util',
		'NP.lib.ui.Uploader',
		'NP.lib.core.KeyManager'
	],
	
	models: ['invoice.InvoiceItem','invoice.InvoicePayment'],

	stores: ['invoice.Invoices','system.PriorityFlags','invoice.InvoicePaymentTypes',
			'invoice.InvoiceItems','invoice.InvoicePayments','shared.Reasons',
			'image.ImageIndexes','shared.RejectionNotes','invoice.InvoicePaymentTypes',
			'invoice.AuditReclasses','NP.store.user.Userprofiles'],
	
	views: ['invoice.Register','invoice.View','invoice.VoidWindow','invoice.HoldWindow',
			'shared.invoicepo.ImagesManageWindow','shared.invoicepo.ImagesAddWindow',
			'shared.invoicepo.UseTemplateWindow','shared.invoicepo.SplitWindow',
			'shared.invoicepo.RejectWindow','invoice.PaymentWindow','invoice.ReclassWindow',
			'vendor.VendorSelectorWindow','shared.invoicepo.ScheduleWindow',
			'shared.invoicepo.TemplateWindow','invoice.ForwardWindow',
			'shared.invoicepo.ChangePropertyWindow','shared.invoicepo.HistoryDetailWindow',
			'shared.invoicepo.BudgetDetailWindow'],

	refs: [
		{ ref: 'paymentGrid', selector: '[xtype="invoice.viewpayments"]' },
		{ ref: 'paymentFormGrid', selector: '[xtype="invoice.paymentwindow"] customgrid' },
		{ ref: 'reclassGrid', selector: '[xtype="invoice.viewreclass"]' }
	],

	shortName  : 'invoice',
	longName   : 'invoice',
	displayName: 'Invoice',

	init: function() {
		var me  = this,
			app = me.application;

		// Setup event handlers
		me.control({
			'[xtype="invoice.view"] [xtype="shared.invoicepo.viewlinegrid"]': {
				beforeedit          : me.onBeforeLineGridEdit.bind(me),
				edit                : me.onAfterLineGridEdit.bind(me),
				selectutilityaccount: me.onSelectUtilityAccount.bind(me),
				changequantity      : me.onChangeQuantity.bind(me),
				changeunitprice     : me.onChangeUnitPrice.bind(me),
				changeamount        : me.onChangeAmount.bind(me),
				tablastfield        : me.onLineAddClick
			},

			'[xtype="invoice.view"] [xtype="shared.invoicepo.viewlineitems"]': {
				lineadd   : me.onStoreAddLine,
				lineupdate: me.onStoreUpdateLine,
				lineremove: me.onStoreRemoveLine,
				linechange: me.setCycleFieldVisibility
			},

			// Invoice date field
			'[xtype="invoice.viewheader"] [name="invoice_datetm"]': {
				select: me.populateDueDate
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

			'#invoiceSubmitForPaymentBtn': {
				click: me.onSubmitForPayment
			},

			'#applyPaymentBtn': {
				click: me.onApplyPayment
			},

			'#applyPaymentSaveBtn': {
				click: me.onApplyPaymentSave
			},

			'[xtype="invoice.viewpayments"]': {
				voidpayment: Ext.bind(me.onVoidNsfPayment, me, ['void'], true),
				nsfpayment : Ext.bind(me.onVoidNsfPayment, me, ['NSF'], true),
				editpayment: me.onEditPayment
			},

			'#invoiceRevertBtn': {
				click: me.onRevert
			},

			'#invoiceReclassBtn': {
				click: me.onReclass
			},

			'#invoiceReclassSaveBtn': {
				click: me.onReclassSave
			}
		});

		me.callParent();
	},
	
	/**
	 * Shows the invoice add/edit page
	 * @param {Number} [invoice_id] Id of the invoice to edit; if not provided, will show page for adding invoice
	 */
	showView: function(invoice_id) {
		var me      = this,
			viewCfg = {
				bind: {
			    	models: ['invoice.Invoice']
			    }
			};

		me.selectedVendor = null;

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
						Ext.suspendLayouts();

						// Manually load the lines in; we do this instead of loading a store because there
						// are a number of things at the header level that depend on the lines. This way
						// we don't need to defer a whole bunch of processes to wait for lines to load,
						// which gets a little dirty and unreliable
						var lineStore = me.getLineDataView().getStore();
						
						lineStore.loadRawData(data.lines);

						// Update everything in the view except lines since we updated them manually above
						me.updateEntityViewState({ lines: true }, false);

						me.setRequiredNotes();

						me.setCycleFieldVisibility();

						me.setInvoiceMaxLen();

						me.loadPayments();

						Ext.resumeLayouts(true);

						// Save to recent records
						me.application.getController('Favorites').saveToRecentRecord('Invoice - ' + data['invoice_ref']);
					}
				}
			});
		}

		var form = me.setView('NP.view.invoice.View', viewCfg, null, true);

		if (!invoice_id) {
			// Setup the title, toolbar, property field, and Pay By field; the other things don't matter/
			// for a new invoice (you don't need to load lines, payments, forwards, etc.)
			me.updateEntityViewState({ title: true, toolbar: true, property: true, payBy: true }, true);
		}
	},

	updateEntityViewState: function(items, include) {
		var me         = this,
			boundForm  = me.getEntityView(),
			data       = boundForm.getLoadedData(),
			invoice    = me.getEntityRecord(),
			invoice_id = invoice.get('invoice_id'),
			i;

		items = items || {};
		include = (arguments.length > 1) ? include : false;

		function updateOption(option) {
			return (
				(include && (option in items))
				|| (!include && !(option in items))
			);
		}

		Ext.suspendLayouts();
		
		// Set the title
		if (updateOption('title')) {
			me.setInvoiceViewTitle();
		}

		// Build the toolbar
		if (updateOption('toolbar')) {
			me.buildViewToolbar(data);
		}
		
		// Show warnings if any
		if (updateOption('warnings')) {
			var warnings = data['warnings'];
			me.getWarningsView().getStore().removeAll();
			me.getWarningsView().getStore().loadRawData(warnings);
			if (warnings.length) {
				me.getWarningsView().up('panel').show();
			}
		}

		var vendorField   = boundForm.findField('vendor_id'),
			propertyField = boundForm.findField('property_id'),
			periodField   = boundForm.findField('invoice_period');

		if (updateOption('vendor')) {
			// Set the vendor
			vendorField.setDefaultRec(Ext.create('NP.model.vendor.Vendor', data));
			vendorField.addExtraParams({
				property_id: data['property_id']
			});
			me.setVendorDisplay();
			me.setVendorFieldState(data['invoice_status']);
		}

		if (updateOption('utility')) {
			var vendorRec = me.getVendorRecord();
			if (vendorRec && vendorRec.get('is_utility_vendor')) {
				NP.Util.deferUntil(me.loadUtilityAccounts, { scope: me });
			}
		}

		if (updateOption('property')) {
			if (invoice_id !== null) {
				// Set the property
				propertyField.setDefaultRec(Ext.create('NP.model.property.Property', data));
				// Add valid periods to the invoice period store
				me.populatePeriods(data['accounting_period'], data['invoice_period']);
			}
			me.setPropertyFieldState(invoice.get('invoice_status'));
		}

		// Load the line store
		if (updateOption('lines')) {
			var lineStore = me.getLineDataView().getStore();
			lineStore.addExtraParams({ entity_id: invoice_id });

			lineStore.load(function() {
				me.setCycleFieldVisibility();

				me.setRequiredNotes();

				// Only load the payment store after the line store because we need the total amount
				me.loadPayments();
			});
		}

		// Set the value for the period field; we need to do it manually because the BoundForm
		// tries to set a date object (from the model) on the field, but since we're not dealing
		// with a date field it doesn't work
		if (updateOption('period')) {
			periodField.setValue(data['invoice_period']);
		}

		if (updateOption('dueDate')) {
			me.populateDueDate();
		}

		// Set the invoice payment to the default if needed
		if (updateOption('payBy')) {
			if (me.getSetting('CP.INVOICE_PAY_BY_FIELD', '0') == '1') {
				var payByField = boundForm.findField('invoicepayment_type_id');
				if (payByField.getValue() === null || payByField.getValue() === 0) {
					me.setDefaultPayBy();
				}
			}
		}

		var notes, noteText;
		if (updateOption('holdNotes')) {
			notes    = data['hold_notes'];
			noteText = [];

			for (i=0; i<notes.length; i++) {
				if (!Ext.isEmpty(notes[i].note)) {
					noteText.push(notes[i].note.replace(/[\n]/g, '<br />'));
				} else {
					noteText.push(notes[i].reason_text);
				}
			}

			if (noteText.length) {
				boundForm.findField('invoice_onhold_notes').setValue(noteText.join('<br />'));
			}
		}

		if (updateOption('rejectionNotes')) {
			notes    = data['rejection_notes'];
			noteText = [];

			for (i=0; i<notes.length; i++) {
				noteText.push(notes[i].rejectionnote_text);
			}

			if (noteText.length) {
				boundForm.findField('reject_reason').setValue(noteText.join('<br />'));
			}
		}

		// Initiate history log store
		if (updateOption('historyLog')) {
			var historyStore = me.getHistoryLogGrid().getStore();
			historyStore.addExtraParams({ entity_id: invoice_id });
			historyStore.load();
		}

		// Initiate forwards log store
		if (updateOption('forwards')) {
			var forwardsStore = me.getForwardsGrid().getStore();
			forwardsStore.addExtraParams({ entity_id: invoice_id });
			forwardsStore.load();
		}

		// Load reclass records and figure out whether or not to show the grid
		if (updateOption('forwards')) {
			me.loadReclass();
		}

		// Load image if needed
		if (updateOption('image')) {
			me.loadImage();
		}

		// Check if the invoice needs to be made readonly
		if (updateOption('readonly')) {
			me.setReadOnly(me.isInvoiceReadOnly());
		}

		Ext.resumeLayouts(true);
	},

	loadPayments: function() {
		var me           = this,
			lineView     = me.getLineView(),
			paymentGrid  = me.getPaymentGrid(),
			paymentStore = paymentGrid.getStore();

		// Only load the payment store after the line store because we need the total amount
		paymentGrid.totalAmount = lineView.getTotalAmount();

		paymentStore.addExtraParams({ invoice_id: me.getEntityRecord().get('invoice_id') });
		paymentStore.load(function() {
			if (paymentStore.getCount()) {
				paymentGrid.show();
			}
		});
	},

	isInvoiceReadOnly: function() {
		var me      = this,
			invoice = me.getEntityRecord(),
			status  = invoice.get('invoice_status');

		if (
			(
				status ==  "draft"
				&& me.hasPermission(2008)
			)
			|| (
				status == "open"
				&& (
					me.hasPermission(6076)
					|| (
						me.hasPermission(6077) 
						&& NP.Security.getUser().get('userprofile_id') == invoice.get('userprofile_id')
					)
				)
			)
			|| (status == "saved" && me.hasPermission(1068))
			|| (status == "paid" && me.hasPermission(2094))
		) {
			return false;
		}

		return true;
	},

	setInvoiceViewTitle: function() {
		var me   = this,
			view = me.getEntityView();

		view.setTitle(me.translate('Invoice: ' + view.getModel('invoice.Invoice').getDisplayStatus()));
	},

	setDefaultPayBy: function() {
		var me         = this,
			payByField = me.getEntityView().findField('invoicepayment_type_id'),
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

	populateDueDate: function() {
		var me           = this,
			form         = me.getEntityView(),
			dueDateField = form.findField('invoice_duedate'),
			rec          = me.getVendorRecord(),
			offset;

		if (dueDateField.getValue() === null) {
			if (rec !== null && rec.get('default_due_date') !== null) {
				offset = rec.get('default_due_date');
			} else {
				offset = parseInt(NP.Config.getSetting('CP.INVOICE_DEFAULT_DUE_DATE_OFFSET', '0'));
			}

			if (offset > 0) {
				var invDate = form.findField('invoice_datetm').getValue(),
					dueDate;

				if (Ext.isDate(invDate)) {
					dueDate = Ext.Date.add(invDate, Ext.Date.DAY, offset);
					dueDateField.setValue(dueDate);
				}
			}
		}
	},

	onPropertyComboSelect: function(propertyCombo, recs) {
		var me = this;

		me.callParent(arguments);

		if (recs.length) {
			me.setInvoiceMaxLen();
		}
	},

	setInvoiceMaxLen: function() {
		var me       = this,
			form     = me.getEntityView(),
			intPkgId = me.getPropertyRecord().get('integration_package_id');
			intPkg   = Ext.getStore('system.IntegrationPackages').getById(intPkgId);
			maxLen   = intPkg.get('invoice_ref_max');

		if (maxLen === null) {
			maxLen = 100;
		}

		form.findField('invoice_ref').maxLength = maxLen;
	},

	changeVendor: function() {
		var me         = this,
			form       = me.getEntityView(),
			data       = form.getLoadedData(),
			vendor     = me.getVendorRecord(),
			cols       = me.getLineGrid().columnManager.getColumns(),
			isUtilGrid = false;

		Ext.suspendLayouts();

		me.callParent();

		if (vendor) {
			if (vendor.get('is_utility_vendor') === 1) {
				me.loadUtilityAccounts();
			}

			for (var i=0; i<cols.length; i++) {
				if (cols[i].dataIndex == 'utilityaccount_id') {
					isUtilGrid = true;
					break;
				}
			}

			if (
				(vendor.get('is_utility_vendor') === 1 && !isUtilGrid)
				|| (vendor.get('is_utility_vendor') !== 1 && isUtilGrid)
			) {
				me.getLineGrid().configureGrid();
			}

			// Set the default remit advice for the vendor
			form.findField('remit_advice').setValue(vendor.get('remit_req'));
		}

		Ext.resumeLayouts(true);
	},

	isUtilityInvoice: function() {
		var me = this;

		return me.getVendorRecord().get('is_utility_vendor');
	},

	setCycleFieldVisibility: function() {
		var me     = this,
			form   = me.getEntityView(),
			store  = me.getLineGrid().getStore(),
			recNum = store.getCount(),
			fn     = 'hide',
			i;

		// Only loop through lines if vendor is a utility vendor, otherwise we know we need to hide the fields
		if (me.isUtilityInvoice()) {
			for (i=0; i<recNum; i++) {
				if (store.getAt(i).get('utilityaccount_id') !== null) {
					fn = 'show';
					break;
				}
			}
		}

		Ext.suspendLayouts();

		Ext.each(['invoice_cycle_from','invoice_cycle_to'], function(fieldName) {
			var field = form.findField(fieldName, true);
			field[fn]();
			field.allowBlank = (fn === 'hide');
		});

		Ext.resumeLayouts(true);
	},

	loadReclass: function() {
		var me           = this,
			invoice_id   = me.getEntityRecord().get('invoice_id'),
			reclassGrid  = me.getReclassGrid(),
			reclassStore = reclassGrid.getStore();

		reclassStore.addExtraParams({ invoice_id: invoice_id });
		reclassStore.load(function() {
			if (reclassStore.getCount()) {
				reclassGrid.show();
			}
		});
	},

	onOpenUtilityAccountEditor: function(editor, rec, field) {
		var me    = this,
			grid  = me.getLineGrid(),
			store = grid.utilityAccountStore;

		me.loadUtilityAccounts(function() {
			store.clearFilter();
			store.filter('property_id', rec.get('property_id'));
			
			if (store.getCount() === 0) {
				field.setReadOnly(true);
			} else {
				field.setReadOnly(false);
			}
		});
	},

	loadUtilityAccounts: function(callback) {
		var me    = this,
			grid  = me.getLineGrid(),
			store = grid.utilityAccountStore;

		callback = callback || Ext.emptyFn;

		me.setUtilityAccountExtraParams();

		if (store.extraParamsHaveChanged()) {
			store.load(function() {
				callback();
			});
		} else {
			callback();
		}
	},

	setUtilityAccountExtraParams: function() {
		var me            = this,
			store         = me.getLineGrid().utilityAccountStore,
			vendorsite_id = me.getVendorRecord().get('vendorsite_id');
		
		store.addExtraParams({ vendorsite_id: vendorsite_id });
	},

	onSelectUtilityAccount: function(grid, combo, recs) {
		var me   = this,
			newRec,
			rec;

        if (recs.length) {
            var rec    = recs[0],
            	glaccount_id = rec.get('glaccount_id'),
	            unit_id      = rec.get('unit_id');

            if (glaccount_id !== null) {
            	me.setGlExtraParams();

            	grid.glStore.loadIfChange(function() {
					// If the current grid value exists in the store, set it
					if (grid.glStore.getById(glaccount_id) !== null) {
						grid.selectedRec.set({
							glaccount_id    : glaccount_id,
							glaccount_number: rec.get('glaccount_number'),
							glaccount_name  : rec.get('glaccount_name')
		            	});
					}
				});
            }

            if (unit_id !== null) {
            	me.setUnitExtraParams();
            	
            	grid.unitStore.loadIfChange(function() {
					// If the current grid value exists in the store, set it
					if (grid.unitStore.getById(unit_id) !== null) {
						grid.selectedRec.set({
							unit_id    : unit_id,
							unit_id_alt: rec.get('unit_id_alt'),
							unit_number: rec.get('unit_number')
		            	});
					}
				});
            }

        	// Verify that the usage type is still valid
        	me.loadUsageTypeStore(function() {
        		if (grid.usageTypeStore.find('UtilityType_Id', grid.selectedRec.get('UtilityType_Id')) === -1) {
        			me.clearUsageType();
        		}
        	});
        } else {
        	grid.selectedRec.set('utilitycolumn_usagetype_id', null);
        }
	},

	clearUtilityAccount: function() {
		var me    = this,
			grid  = me.getLineGrid(),
			rec   = grid.selectedRec,
			store = grid.getStore();
		
		rec.set('utilityaccount_id', null);
		rec.set('UtilityAccount_AccountNumber', null);
		rec.set('UtilityAccount_MeterSize', null);
		rec.set('UtilityType_Id', null);
		rec.set('UtilityType', null);

		me.clearUsageType();
	},

	onOpenUsageTypeEditor: function(editor, rec, field) {
		var me    = this,
			grid  = me.getLineGrid(),
			store = grid.usageTypeStore,
			data;

		me.setUsageTypeExtraParams();

		if (rec.get('utilityaccount_id') === null) {
			field.setValue(null);
			field.setReadOnly(true);
			return;
		}

		field.setReadOnly(false);

		if (store.extraParamsHaveChanged() && grid.selectedRec.get('utilitycolumn_usagetype_id') !== null) {
			store.removeAll();
			data = {
				UtilityColumn_UsageType_Id  : grid.selectedRec.get('utilitycolumn_usagetype_id'),
				UtilityColumn_UsageType_Name: grid.selectedRec.get('UtilityColumn_UsageType_Name')
			};
			store.add(data);
		}
	},

	loadUsageTypeStore: function(callback) {
		var me             = this,
			grid           = me.getLineGrid(),
			store          = grid.usageTypeStore,
			UtilityType_Id = grid.selectedRec.get('UtilityType_Id');

		callback = callback || Ext.emptyFn;

		me.setUsageTypeExtraParams();

		if (store.extraParamsHaveChanged() && UtilityType_Id !== null) {
			store.load(callback);
		} else {
			if (UtilityType_Id === null) {
				store.removeAll();
			}
			callback(store.getRange());
		}
	},

	setUsageTypeExtraParams: function() {
		var me             = this,
			store          = me.getLineGrid().usageTypeStore,
			rec            = me.getLineGrid().selectedRec,
			UtilityType_Id = rec.get('UtilityType_Id');
		
		if (UtilityType_Id !== null) {
			store.addExtraParams({ UtilityType_Id: UtilityType_Id });
		} else {
			store.setExtraParams({});
		}
	},

	clearUsageType: function() {
		var me   = this,
			grid = me.getLineGrid();

		grid.selectedRec.set('utilitycolumn_usagetype_id', null);
		grid.selectedRec.set('UtilityColumn_UsageType_Name', null);
	},

	onBeforeLineGridEdit: function(editor, e) {
		var me        = this,
			vendorRec = me.getVendorRecord(),
			grid      = me.getLineGrid();

		if (
			vendorRec.get('is_utility_vendor')
			&& (
				!grid.selectedRec 
				|| grid.selectedRec.get('property_id') != e.record.get('property_id')
			)
		) {
			grid.selectedRec = e.record;
			me.filterUtilityRecords();
		}

		me.callParent(arguments);
	},

	onChangeLineProperty: function() {
		var me        = this,
			vendorRec = me.getVendorRecord();

		if (vendorRec.get('is_utility_vendor')) {
			var grid              = me.getLineGrid(),
				utilityaccount_id = grid.selectedRec.get('utilityaccount_id'),
				utilStore         = grid.utilityAccountStore,
				currentUtilCount  = utilStore.getCount();

			Ext.suspendLayouts();

			me.callParent();

			// If there's a Utlity Account set in the column, it would not longer be valid with a property change
			// so clear it
			if (utilityaccount_id !== null) {
				me.clearUtilityAccount();
			}

			me.filterUtilityRecords();

			Ext.resumeLayouts(true);
		}
	},

	filterUtilityRecords: function() {
		var me        = this,
			grid      = me.getLineGrid(),
			utilStore = grid.utilityAccountStore;

		utilStore.clearFilter();

		// We use an even handler for this because otherwise it appears that sometimes
		// the code would run without the store count being accurate
		utilStore.on('filterchange', function() {
			// If there are no utility accounts, we assume we're not dealing with utilities for this line
			var is_utility = (grid.utilityAccountStore.getCount() > 0) ? 1 : 0;
			grid.selectedRec.set('is_utility', is_utility);
			// Setup utility editors
			grid.setupUtilityEditors();

			// Refresh the grid view so that the money field renderers are triggered
			grid.getView().refresh();
		}, me, { single: true });

		// Filter the store (which should then trigger the event handler above once complete)
		utilStore.filter('property_id', grid.selectedRec.get('property_id'));
	},

	validateHeader: function(isSubmit) {
		var me      = this,
			form    = me.getEntityView(),
			isValid;

		Ext.suspendLayouts();

		isValid = me.callParent(arguments);

		if (isSubmit) {
			isValid = form.isValid();

			var totalAmount   = me.getLineView().getTotalAmount(),
				controlAmount = form.findField('control_amount').getValue();

			if (controlAmount !== null && controlAmount != totalAmount) {
				form.findField('control_amount').markInvalid(
					me.translate('Invoice Total must be equal to line total.')
				);
				isValid = false;
			}
		}

		Ext.resumeLayouts(true);

		return isValid;
	},

	validateLineItem: function(rec, col, val) {
		var me    = this,
			store = me.getLineGrid().utilityAccountStore;

		if (col.dataIndex == 'utilityaccount_id' || col.dataIndex == 'utilitycolumn_usagetype_id') {
			store.clearFilter();
			
			if (store.find('property_id', rec.get('property_id')) > -1 && val === null) {
				return 'This field is required';
			}
		}

		return null;
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
			invoice_id = me.getEntityRecord().get('invoice_id');

			NP.Net.remoteCall({
				method  : 'POST',
				requests: {
					service   : 'InvoiceService',
					action    : 'placeOnHold',
					invoice_id: invoice_id,
					reason_id : reasonField.getValue(),
					note      : noteField.getValue(),
					success   : function(result) {
						if (!result.success) {
							me.showUnexpectedError()
						} else {
							NP.Util.showFadingWindow({
								html: me.translate('The invoice has been placed on hold')
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
			dialogTitle = me.translate('Activate Invoice?'),
			dialogText  = me.translate('Are you sure you want to activate the Invoice?');

		Ext.MessageBox.confirm(dialogTitle, dialogText, function(btn) {
			// If user clicks Yes, proceed with deleting
			if (btn == 'yes') {
				var invoice_id = me.getEntityRecord().get('invoice_id');

				// Ajax request to delete catalog
				NP.Net.remoteCall({
					requests: {
						service   : 'InvoiceService',
						action    : 'activate',
						invoice_id: invoice_id,
						success   : function(result) {
							if (!result.success) {
								me.showUnexpectedError();
							} else {
								NP.Util.showFadingWindow({
									html: me.translate('The invoice has been activated')
								});

								me.showView(invoice_id);
							}
						}
					}
				});
			}
		});
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
			invoice_id = me.getEntityRecord().get('invoice_id');

			NP.Net.remoteCall({
				method  : 'POST',
				requests: {
					service   : 'InvoiceService',
					action    : 'void',
					invoice_id: invoice_id,
					note      : noteField.getValue(),
					success   : function(result) {
						if (!result.success) {
							me.showUnexpectedError();
						} else {
							NP.Util.showFadingWindow({
								html: me.translate('The invoice has been voided')
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

	onSubmitForPayment: function() {
		var me         = this,
			invoice_id = me.getEntityRecord().get('invoice_id');

		me.saveInvoice(
			'InvoiceService',
			'saveInvoice',
			{},
			true,
			function(result) {
				if (result.success) {
					NP.Net.remoteCall({
						mask    : me.getEntityView(),
						method  : 'POST',
						requests: {
							service   : 'InvoiceService',
							action    : 'submitForPayment',
							invoice_id: invoice_id,
							success   : function(result) {
								if (result.success) {
									// Show info message
									NP.Util.showFadingWindow({ html: me.translate('Invoice has been submitted for payment') });

									me.showView(invoice_id);
								} else {
									Ext.MessageBox.alert(
										me.translate('Error'),
										me.translate(result.errors[0].msg)
									);
								}
							}
						}
					});
				}
			}
		);
	},

	onApplyPayment: function() {
		var me = this;

		me.showPaymentWindow();
        me.onAddPayment();
	},

	showPaymentWindow: function() {
		var me      = this,
			invoice = me.getEntityRecord(),
			win     = Ext.widget('invoice.paymentwindow', {
				invoice_status: invoice.get('invoice_status'),
				invoice_ref   : invoice.get('invoice_ref'),
				invoice_amount: invoice.get('entity_amount')
	        });

        win.show();
	},

	onAddPayment: function() {
		var me    = this,
			store = me.getPaymentFormGrid().getStore(),
			now   = new Date();

		store.add(Ext.create('NP.model.invoice.InvoicePayment', {
			invoicepayment_datetm: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
		}));
	},

	onEditPayment: function(rec) {
		var me = this;

        me.showPaymentWindow();
        me.getPaymentFormGrid().getStore().add(rec.copy());
	},

	onApplyPaymentSave: function() {
		var me         = this,
			win        = me.getCmp('invoice.paymentwindow'),
			invoice_id = me.getEntityRecord().get('invoice_id'),
			payments   = [],
			recs,
			mark_as_paid;

		if (win.isValid()) {
			// Get all recs in the grid
			recs = me.getPaymentFormGrid().getStore().getRange();

			// Get the raw data for the records
			for (var i=0; i<recs.length; i++) {
				payments.push(recs[i].getData());
			}

			// Get the value for the radio button field group
			mark_as_paid = 0;
			if (win.down('#mark_as_paid')) {
				mark_as_paid = win.down('#mark_as_paid').getValue()['mark_as_paid'];
			}

			// Submit the payments
			NP.Net.remoteCall({
				requests: {
					service     : 'InvoiceService',
					action      : 'savePayments',
					invoice_id  : invoice_id,
					mark_as_paid: mark_as_paid,
					payments    : payments,
					success     : function(result) {
						// If request was successful, update the lock_id on the invoice
						if (result.success) {
							if (mark_as_paid == 0) {
								me.getEntityRecord().set('lock_id', result.lock_id);
								me.getPaymentGrid().getStore().load();
								me.getPaymentGrid().show();
							} else {
								me.showView(invoice_id);
							}

							win.close();
						} else {
							me.showUnexpectedError();
						}
					}
				}
			});
		} else {
			Ext.MessageBox.alert(
				me.translate('Error'),
				me.translate(win.getErrorMsg())
			);
		}
	},

	onVoidNsfPayment: function(rec, status) {
		var me = this;

		NP.Net.remoteCall({
			requests: {
				service              : 'InvoiceService',
				action               : 'savePaymentStatus',
				invoicepayment_id    : rec.get('invoicepayment_id'),
				invoicepayment_status: status,
				success              : function(result) {
					if (result.success) {
						// Update the lock_id on the invoice
						me.getEntityRecord().set('lock_id', result.lock_id);
						// Reload the payment grid
						me.getPaymentGrid().getStore().load();
					} else {
						me.showUnexpectedError();
					}
				}
			}
		});
	},

	onRevert: function() {
		var me          = this,
			invoice_id  = me.getEntityRecord().get('invoice_id'),
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
	},

	onReclass: function() {
		var win = Ext.widget('invoice.reclasswindow');
		win.show();
	},

	onReclassSave: function() {
		var me            = this,
			win           = me.getCmp('invoice.reclasswindow'),
			reclass_notes = win.down('[name="reclass_notes"]');

		if (reclass_notes.isValid()) {
			me.saveInvoice(
				'InvoiceService',
				'reclass',
				{
					reclass_notes: reclass_notes.getValue()
				},
				true,
				function(result) {
					if (result.success) {
						// Show info message
						NP.Util.showFadingWindow({ html: me.translate('Invoice has been reclassed') });

						me.getEntityRecord().set('lock_id', result.lock_id);

						me.loadReclass();

						win.close();
					}
				}
			);
		}
	},
});