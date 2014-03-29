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
			'invoice.AuditReclasses'],
	
	views: ['invoice.Register','invoice.View','invoice.VoidWindow','invoice.HoldWindow',
			'shared.invoicepo.ImagesManageWindow','shared.invoicepo.ImagesAddWindow',
			'invoice.UseTemplateWindow','shared.invoicepo.SplitWindow',
			'shared.invoicepo.RejectWindow','invoice.PaymentWindow','invoice.ReclassWindow',
			'NP.view.vendor.VendorSelectorWindow'],

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
				selectusagetype     : me.onSelectUsageType.bind(me),
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
			forwardStore,
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
						me.updateEntityViewState();

						// Save to recent records
						me.application.getController('Favorites').saveToRecentRecord('Invoice - ' + data['invoice_ref']);
					}
				}
			});
		}

		var form = me.setView('NP.view.invoice.View', viewCfg, null, true);

		if (!invoice_id) {
			// Setup the title, toolbar, property field, and Pay By field
			me.updateEntityViewState({ title: true, toolbar: true, property: true, payBy: true }, true);
		}
	},

	updateEntityViewState: function(items, include) {
		var me         = this,
			boundForm  = me.getEntityView(),
			data       = boundForm.getLoadedData(),
			invoice    = me.getEntityRecord(),
			invoice_id = invoice.get('invoice_id');

		items = items || {};
		include = (arguments.length > 1) ? include : false;

		function updateOption(option) {
			return (
				(include && (option in items))
				|| (!include && !(option in items))
			);
		}

		Ext.suspendLayouts();

		// Check if the invoice needs to be made readonly
		if (updateOption('readonly')) {
			me.setReadOnly(me.isInvoiceReadOnly());
		}
		
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
			if (warnings.length) {
				me.getWarningsView().getStore().add(warnings);
				me.getWarningsView().up('panel').show();
			}
		}

		var lineView     = me.getLineView(),
			lineStore    = me.getLineDataView().getStore(),
			paymentGrid  = me.getPaymentGrid(),
			paymentStore = paymentGrid.getStore();

		// Load the line store
		if (updateOption('lines')) {
			lineStore.addExtraParams({ entity_id: invoice_id });

			lineStore.load(function() {
				me.setCycleFieldVisibility();

				// Only load the payment store after the line store because we need the total amount
				paymentGrid.totalAmount = lineView.getTotalAmount();

				paymentStore.addExtraParams({ invoice_id: invoice_id });
				paymentStore.load(function() {
					if (paymentStore.getCount()) {
						me.getPaymentGrid().show();
					}
				});
			});
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
			if (data['is_utility_vendor']) {
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

		Ext.resumeLayouts(true);
	},

	setPropertyFieldState: function(invoice_status) {
		var me    = this,
			field = me.getPropertyCombo();

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

	setVendorFieldState: function(invoice_status) {
		var me     = this,
			field  = me.getVendorCombo(),
			el     = Ext.get('entityVendorSelectOption'),
			showFn = 'hide';

		// Only allow changing the property field if the invoice is open or a draft
		if (invoice_status == 'draft' || invoice_status == 'open') {
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

	isInvoiceReadOnly: function() {
		var me      = this,
			invoice = me.getEntityRecord(),
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

	isUtilityInvoice: function() {
		var me = this;

		return me.getEntityView().getLoadedData().is_utility_vendor;
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
            	newRec = {
	                utilityaccount_id           : rec.get('UtilityAccount_Id'),
	                UtilityAccount_AccountNumber: rec.get('UtilityAccount_AccountNumber'),
	                UtilityAccount_MeterSize    : rec.get('UtilityAccount_MeterSize'),
	                UtilityType_Id              : rec.get('UtilityType_Id'),
	                UtilityType                 : rec.get('UtilityType')
	            },
	            glaccount_id = rec.get('glaccount_id'),
	            unit_id      = rec.get('unit_id');

            if (glaccount_id !== null) {
            	me.setGlExtraParams(grid, grid.selectedRec);

            	grid.glStore.load(function() {
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
            	me.onOpenUnitEditor(null, grid, grid.selectedRec, null);
            	
            	grid.unitStore.load(function() {
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

        	grid.selectedRec.set(newRec);

        	// Verify that the usage type is still valid
        	me.loadUsageTypeStore(function() {
        		if (grid.usageTypeStore.find('UtilityType_Id', grid.selectedRec.get('UtilityType_Id')) === -1) {
        			me.clearUsageType();
        		}
        	});
        } else {
            me.clearUtilityAccount();
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
			store = grid.usageTypeStore;

		me.setUsageTypeExtraParams();

		if (rec.get('utilityaccount_id') === null) {
			field.setValue(null);
			field.setReadOnly(true);
			return;
		}

		if (rec.get('utilitycolumn_usagetype_id') === null) {
			me.loadUsageTypeStore(function() {
				if (store.getCount() === 0) {
					field.setValue(null);
					field.setReadOnly(true);
				} else {
					field.setReadOnly(false);
				}
			});
		} else {
			store.removeAll();
			data = grid.selectedRec.getData();
			data['UtilityColumn_UsageType_Id'] = data['utilitycolumn_usagetype_id'];
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
			store.load(function() {
				callback();
			});
		} else {
			if (UtilityType_Id === null) {
				store.removeAll();
			}
			callback();
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

	onSelectUsageType: function(grid, combo, recs) {
		var me = this;

        if (recs.length) {
            var newRec = {
                utilitycolumn_usagetype_id  : recs[0].get('UtilityColumn_UsageType_Id'),
                UtilityColumn_UsageType_Name: recs[0].get('UtilityColumn_UsageType_Name')
            }

        	grid.selectedRec.set(newRec);
        } else {
            me.clearUsageType();
        }
	},

	clearUsageType: function() {
		var me   = this,
			grid = me.getLineGrid();

		grid.selectedRec.set('utilitycolumn_usagetype_id', null);
		grid.selectedRec.set('UtilityColumn_UsageType_Name', null);
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
	}
});