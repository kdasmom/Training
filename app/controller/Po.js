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
		'NP.lib.core.KeyManager',
		'NP.store.system.PnUniversalFields'
	],
	
	models: ['po.PoItem','NP.model.system.PrintTemplate'],

	stores: ['po.Purchaseorders','system.PriorityFlags','po.PoItems','shared.Reasons',
			'image.ImageIndexes','shared.RejectionNotes'],
	
	views: ['po.Register','po.View','shared.invoicepo.ImagesManageWindow','shared.invoicepo.ImagesAddWindow',
			'shared.invoicepo.SplitWindow','shared.invoicepo.RejectWindow','NP.view.vendor.VendorSelectorWindow',
			'NP.view.shared.invoicepo.ScheduleWindow','NP.view.shared.invoicepo.TemplateWindow',
			'shared.invoicepo.UseTemplateWindow'],

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
			},

			'[xtype="po.viewshippingbilling"] [xtype="shared.propertycombo"]': {
				select: me.onSelectBillToShipTo
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

						// Manually load the lines in; we do this instead of loading a store because there
						// are a number of things at the header level that depend on the lines. This way
						// we don't need to defer a whole bunch of processes to wait for lines to load,
						// which gets a little dirty and unreliable
						var lineStore = me.getLineDataView().getStore();
						
						lineStore.loadRawData(data.lines);

						// Update everything in the view except lines since we updated them manually above
						me.updateEntityViewState({ lines: true }, false);

						// Show the Ship To/Bill To panel
						me.getCmp('po.viewshippingbilling').show();

						me.setRequiredNotes();

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
			me.setPoViewTitle();

			me.buildViewToolbar();

			// Enable the property field when dealing with a new invoice
			form.findField('property_id').enable();
		}
	},

	updateEntityViewState: function(items, include) {
		var me               = this,
			boundForm        = me.getEntityView(),
			data             = boundForm.getLoadedData(),
			po               = me.getEntityRecord(),
			purchaseorder_id = po.get('purchaseorder_id'),
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
			me.setPoViewTitle();
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
				me.getWarningsView().getStore().loadRawData(warnings);
				me.getWarningsView().up('panel').show();
			}
		}

		var vendorField   = boundForm.findField('vendor_id'),
			propertyField = boundForm.findField('property_id'),
			periodField   = boundForm.findField('purchaseorder_period');

		if (updateOption('vendor')) {
			// Set the vendor
			vendorField.setDefaultRec(Ext.create('NP.model.vendor.Vendor', data));
			vendorField.addExtraParams({
				property_id: data['property_id']
			});
			me.setVendorDisplay();
			me.setVendorFieldState(data['purchaseorder_status']);
		}

		if (updateOption('property')) {
			if (purchaseorder_id !== null) {
				// Set the property
				propertyField.setDefaultRec(Ext.create('NP.model.property.Property', data));
				// Add valid periods to the invoice period store
				me.populatePeriods(data['accounting_period'], data['purchaseorder_period']);
			}
			me.setPropertyFieldState(po.get('purchaseorder_status'));
		}

		if (updateOption('terms')) {
			if (NP.Config.getSetting('PN.POOptions.templateAssociation', '') == 'Header') {
				var termField = boundForm.findField('print_template_id');

				if (data['print_template_id'] !== null) {
					// Set the template
					termField.setDefaultRec(Ext.create('NP.model.system.PrintTemplate', {
						Print_Template_Id: data['print_template_id'],
						Print_Template_Name: data['Print_Template_Name']
					}));
				}

				termField.addExtraParams({
					property_id: data['property_id']
				});
			}
		}

		if (updateOption('serviceFields')) {
			if (data['is_service_vendor']) {
				me.displayServiceFields(data['service_fields']);
			}
		}

		if (updateOption('shipBill')) {
			Ext.each(['ship','bill'], function(type) {
				if (data['Purchaseorder_' + type + '_propertyID'] !== null) {
					var shipBillField = boundForm.findField('Purchaseorder_' + type + '_propertyID');
					// Set the field
					shipBillField.setDefaultRec(Ext.create('NP.model.property.Property', {
						property_id    : data['Purchaseorder_' + type + '_propertyID'],
						property_name  : data[type + '_property_name'],
						property_status: data[type + '_property_status']
					}));
				}
			});
		}

		// Load the line store
		if (updateOption('lines')) {
			var lineStore = me.getLineDataView().getStore();
			lineStore.addExtraParams({ entity_id: purchaseorder_id });

			lineStore.load(function() {
				me.setRequiredNotes();
			});
		}

		// Set the value for the period field; we need to do it manually because the BoundForm
		// tries to set a date object (from the model) on the field, but since we're not dealing
		// with a date field it doesn't work
		if (updateOption('period')) {
			periodField.setValue(data['purchaseorder_period']);
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
			historyStore.addExtraParams({ entity_id: purchaseorder_id });
			historyStore.load();
		}

		// Initiate forwards log store
		if (updateOption('forwards')) {
			var forwardsStore = me.getForwardsGrid().getStore();
			forwardsStore.addExtraParams({ entity_id: purchaseorder_id });
			forwardsStore.load();
		}

		// Load image if needed
		if (updateOption('image')) {
			me.loadImage();
		}

		// Check if the invoice needs to be made readonly
		if (updateOption('readonly')) {
			me.setReadOnly(me.isPoReadOnly());
		}

		Ext.resumeLayouts(true);
	},

	setPoViewTitle: function() {
		var me    = this,
			view  = me.getEntityView(),
			po    = me.getEntityRecord(),
			title = NP.Translator.translate('Purchase Order: ');

		if (po.get('purchaseorder_id') !== null) {
			title += po.get('purchaseorder_ref') + ' - ';
		}

		title += po.getDisplayStatus();

		view.setTitle(title);
	},

	setReadOnly: function() {
		var me               = this,
			form             = me.getEntityView(),
			shipBillReadOnly = !(NP.Security.hasPermission(6013));

		Ext.suspendLayouts();

		me.callParent();
		
		form.findField('Purchaseorder_ship_propertyID').setReadOnly(shipBillReadOnly);
		form.findField('Purchaseorder_shipaddress').setReadOnly(shipBillReadOnly);
		form.findField('Purchaseorder_bill_propertyID').setReadOnly(shipBillReadOnly);
		form.findField('Purchaseorder_billaddress').setReadOnly(shipBillReadOnly);

		Ext.resumeLayouts(true);
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
	},

	onSelectBillToShipTo: function(combo, recs) {
		var me      = this,
			type    = combo.getStore().getExtraParams().type,
			field   = me.getEntityView().findField('Purchaseorder_' + type + 'address'),
			val     = '';

		if (recs.length) {
			var rec          = recs[0],
				address_attn = rec.get('address_attn'),
				property     = me.getPropertyRecord(),
				address      = rec.getAddressHtml();

			if (!Ext.isEmpty(address_attn)) {
				val = address_attn + '\n';
			}
			val += rec.get('property_name') + '\n';

			if (type == 'bill' && property.get('property_NexusServices') == 1) {
				val += 'NXS #: ' + me.getVendorRecord().get('vendor_id_alt') + 
							' - ' + property.get('property_id_alt') + '\n';
			}

			address = address.replace(/<div>/g, '').replace(/<\/div>/g, '\n').replace(/\n$/, '');

			val += address;
		}

		field.setValue(val);
	},

	displayServiceFields: function(fields) {
		var me    = this,
			form  = me.getEntityView(),
			panel = form.down('#poServiceFieldContainer'),
			cfg;

		Ext.suspendLayouts();

		panel.removeAll();

		Ext.each(fields, function(field) {
			// Default field config
			cfg = {
				name          : field.customfield_name,
				fieldLabel    : field.customfield_label,
				allowBlank    : (field.customfield_required == 0),
				isServiceField: 1
			};

			// If text field, do this
			if (field.customfield_type == 'text') {
				Ext.apply(cfg, {
					xtype: 'textfield',
					value: field.customfielddata_value
				});

				if (Ext.isNumeric(field.customfield_max_length)) {
					cfg.maxLength = field.customfield_max_length;
				}

				panel.add(cfg);
			}
			// If date field, do this
			else if (field.customfield_type == 'date') {
				var fieldObj = panel.add(
					Ext.apply(cfg, {
						xtype: 'datefield'
					})
				);

				// Since this is a date field, we need to transform the value into a date object
				if (!Ext.isEmpty(field.customfielddata_value)) {
					fieldObj.setValue(Ext.Date.parse(field.customfielddata_value, fieldObj.format));
				}
			}
			// Otherwise, if combo, do this
			else if (field.customfield_type == 'select') {
				var fieldObj = panel.add(
						Ext.apply(cfg, {
						xtype        : 'customcombo',
						displayField : 'universal_field_data',
						valueField   : 'universal_field_data',
						useSmartStore: true,
						store        : {
							type   : 'system.pnuniversalfields',
							service: 'ConfigService',
							action : 'getCustomFieldOptions',
							extraParams: {
								customfield_pn_type   : 'po',
								universal_field_number: field.universal_field_number,
								activeOnly            : true
							}
						}
					})
				);

				// Set the default value in the store since it doesn't load by default
				if (!Ext.isEmpty(field.customfielddata_value)) {
					fieldObj.setDefaultRec({ universal_field_data: field.customfielddata_value });
				}
			}
		});

		panel.show();

		Ext.resumeLayouts(true);
	}
});