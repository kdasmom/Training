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
	
	stores: ['invoice.Invoices'],
	
	refs: [
		{ ref: 'invoiceView', selector: '[xtype="invoice.view"]' },
		{ ref: 'forwardsGrid', selector: '[xtype="shared.invoicepo.forwardsgrid"]' },
		{ ref: 'lineView', selector: '[xtype="shared.invoicepo.viewlines"]' },
		{ ref: 'lineGrid', selector: '[xtype="shared.invoicepo.viewlinegrid"]' }
	],

	init: function() {
		Ext.log('Invoice controller initialized');

		var app = this.application;

		// Setup event handlers
		this.control({
			// Clicking on an Invoice Register tab
			'[xtype="invoice.register"] tabpanel': {
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('Invoice.onTabChange() running');
					
					var activeTab = newCard.getItemId().replace('invoice_grid_', '').toLowerCase();
					this.addHistory('Invoice:showRegister:' + activeTab);
				}
			},
			// Clicking on an invoice in an Invoice Register grid
			'[xtype="invoice.register"] tabpanel > grid': {
				itemclick: function(gridView, record, item, index, e, eOpts) {
					this.addHistory( 'Invoice:showView:' + record.get('invoice_id') );
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
						var vendorField   = boundForm.findField('vendor_id')
							vendorDisplay = boundForm.down('#vendor_display'),
							propertyField = boundForm.findField('property_id'),
							periodField   = boundForm.findField('invoice_period'),
							payByField    = boundForm.findField('invoicepayment_type_id');

						// Set the vendor
						vendorField.setDefaultRec(Ext.create('NP.model.vendor.Vendor', {
														vendor_id    : data['vendor_id'],
														vendor_id_alt: data['vendor_id_alt'],
														vendor_name  : data['vendor_name']
													}));
						
						vendorDisplay.update('<b>' + data['vendor_name'] + ' ( ' + data['vendor_id_alt'] + ' )</b>');
						vendorDisplay.show();

						// Set the property
						propertyField.setDefaultRec(Ext.create('NP.model.property.Property', {
														property_id    : data['property_id'],
														property_id_alt: data['property_id_alt'],
														property_name  : data['property_name']
													}));
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
					}
				}
			});
		}

		me.setView('NP.view.invoice.View', viewCfg);

		if (invoice_id) {
			// Get forwards
			var forwardStore = me.getForwardsGrid().getStore();
			forwardStore.addExtraParams({ invoice_id: invoice_id });
			forwardStore.load();

			// Get invoice line items
			var lineStore = me.getLineView().getStore();
			lineStore.addExtraParams({ invoice_id: invoice_id });
			lineStore.load();
		} else {
			me.setDefaultPayBy();
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
			periods          = [];

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