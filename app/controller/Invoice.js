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
		{ ref: 'warningsView', selector: '[xtype="shared.invoicepo.viewwarnings"] dataview' }
	],

	showInvoiceImage: true,

	init: function() {
		Ext.log('Invoice controller initialized');

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

						// Set the title
						me.setInvoiceViewTitle();

						var vendorField   = boundForm.findField('vendor_id'),
							propertyField = boundForm.findField('property_id'),
							periodField   = boundForm.findField('invoice_period'),
							payByField    = boundForm.findField('invoicepayment_type_id');

						// Set the vendor
						vendorField.setDefaultRec(Ext.create('NP.model.vendor.Vendor', data));
						vendorField.addExtraParams({
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
						/*me.loadImage();*/
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
		} else {
			// Set the title
			me.setInvoiceViewTitle();

			// Enable the vendor and property field when dealing with a new invoice
			form.findField('vendor_id').enable();
			form.findField('property_id').enable();

			me.setDefaultPayBy();
		}
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