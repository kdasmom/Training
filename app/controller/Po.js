/**
 * The Po controller deals with operations in the Purchase Order section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.Po', {
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
	
	models: ['po.PoItem'],

	stores: ['po.Purchaseorders','system.PriorityFlags','po.PoItems','shared.Reasons',
			'image.ImageIndexes','shared.RejectionNotes'],
	
	views: ['po.Register','po.View','shared.invoicepo.ImagesManageWindow','shared.invoicepo.ImagesAddWindow',
			'shared.invoicepo.SplitWindow','shared.invoicepo.RejectWindow','NP.view.vendor.VendorSelectorWindow',
			'NP.view.shared.invoicepo.ScheduleWindow','NP.view.shared.invoicepo.TemplateWindow'/*,
			'invoice.UseTemplateWindow'*/],

	shortName  : 'po',
	longName   : 'purchaseorder',
	displayName: 'Purchase Order',

	init: function() {
		Ext.log('Po controller initialized');

		var me  = this,
			app = me.application;

		// Setup event handlers
		me.control({
			'[xtype="po.view"] [xtype="shared.invoicepo.viewlinegrid"]': {
				beforeedit     : me.onBeforeLineGridEdit.bind(me),
				edit           : me.onAfterLineGridEdit.bind(me),
				changequantity : me.onChangeQuantity.bind(me),
				changeunitprice: me.onChangeUnitPrice.bind(me),
				changeamount   : me.onChangeAmount.bind(me),
				tablastfield   : me.onLineAddClick
			},

			'[xtype="po.view"] [xtype="shared.invoicepo.viewlineitems"]': {
				lineadd   : me.onStoreAddLine,
				lineupdate: me.onStoreUpdateLine,
				lineremove: me.onStoreRemoveLine
			}
		});

		me.callParent();
	},
	
	/**
	 * Shows the PO add/edit page
	 * @param {Number} [purchaseorder_id] Id of the PO to edit; if not provided, will show page for adding PO
	 */
	showView: function(purchaseorder_id) {
		var me      = this,
			forwardStore,
			viewCfg = {
				bind: {
			    	models: ['po.Purchaseorder']
			    }
			};

		me.selectedVendor = null;

		if (purchaseorder_id) {
			Ext.apply(viewCfg.bind, {
				service    : me.service,
				action     : 'get',
				extraParams: { purchaseorder_id: purchaseorder_id }
			});

			Ext.apply(viewCfg, {
				listeners      : {
					dataloaded: function(boundForm, data) {
						Ext.suspendLayouts();

						// Check if the PO needs to be made readonly
						me.setReadOnly(me.isPoReadOnly());
						
						// Set the title
						//me.setPoViewTitle();

						// Build the toolbar
						me.buildViewToolbar(data);
						
						// Show warnings if any
						var warnings = data['warnings'];
						if (warnings.length) {
							me.getWarningsView().getStore().add(warnings);
							me.getWarningsView().up('panel').show();
						}

						var lineView     = me.getLineView(),
							lineStore    = me.getLineDataView().getStore();

						// Add purchaseorder_id to the line and payment stores
						lineStore.addExtraParams({ entity_id: purchaseorder_id });

						// Load the line store
						lineStore.load();

						var vendorField   = boundForm.findField('vendor_id'),
							propertyField = boundForm.findField('property_id'),
							periodField   = boundForm.findField('purchaseorder_period');

						// Set the vendor
						vendorField.setDefaultRec(Ext.create('NP.model.vendor.Vendor', data));
						vendorField.addExtraParams({
							property_id: data['property_id']
						});
						me.setVendorDisplay();

						// Set the property
						propertyField.setDefaultRec(Ext.create('NP.model.property.Property', data));
						// Add valid periods to the invoice period store
						me.populatePeriods(data['accounting_period'], data['purchaseorder_period']);
						me.setPropertyFieldState(data['purchaseorder_status']);

						// Set the value for the period field; we need to do it manually because the BoundForm
						// tries to set a date object (from the model) on the field, but since we're not dealing
						// with a date field it doesn't work
						periodField.setValue(data['purchaseorder_period']);

						// Initiate some stores that depend on an purchaseorder_id
						Ext.each(['HistoryLogGrid','ForwardsGrid'], function(viewName) {
							var store = me['get'+viewName]().getStore();
							store.addExtraParams({ entity_id: purchaseorder_id });
							store.load();
						});

						// Load image if needed
						me.loadImage();

						Ext.resumeLayouts(true);

						// Save to recent records
						//me.application.getController('Favorites').saveToRecentRecord('PO - ' + data['purchaseorder_ref']);
					}
				}
			});
		}
		
		var form = me.setView('NP.view.po.View', viewCfg, null, true);

		if (!purchaseorder_id) {
			// Set the title
			//me.setPoViewTitle();

			me.buildViewToolbar();

			// Enable the property field when dealing with a new invoice
			form.findField('property_id').enable();
		}
	},

	setPropertyFieldState: function(purchaseorder_status) {
		var me    = this,
			field = me.getPropertyCombo();

		// Only allow changing the property field if the invoice is open and user has one of
		// the following permissions: 'New Invoice', 'Modify Any', 'Modify Only Created';
		// OR if the invoice is completed, user has 'Invoice Post Approval Modify' permission,
		// and post approval modify is turned on
		if (
			(
				purchaseorder_status == 'open'
				&& (
					me.hasPermission(1032) 
					|| me.hasPermission(6076) 
					|| me.hasPermission(6077)
				)
			)
			|| (
				purchaseorder_status == 'saved' 
				&& me.hasPermission(1068) 
				&& me.getSetting('PN.InvoiceOptions.SkipSave') == '0'
			)
		) {
			field.enable();
		} else {
			field.disable();
		}		
	},

	isPoReadOnly: function() {
		var me      = this,
			po      = me.getEntityRecord(),
			status  = po.get('purchaseorder_status');

		if (
			(
				status == "open"
				&& me.hasPermission(1027)		// New PO permission
			)
			|| (
				status ==  "draft"
				&& me.hasPermission(2007)		// PO Templates permission
			)
			|| (
				me.hasPermission(6074) 			// Modify Any permission
				|| (
					me.hasPermission(6075) 		// Modify Only Created permission
					&& NP.Security.getUser().get('userprofile_id') == po.get('userprofile_id')
				)
			)
			|| (
				status == "saved"
				&& (
					me.hasPermission(6023)		// Mark Items as Received permission
					|| me.hasPermission(6011)	// Post Approval Modify permission
				)
			)
		) {
			return false;
		}

		return true;
	}
});