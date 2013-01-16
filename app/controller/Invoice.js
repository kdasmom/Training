Ext.define('NP.controller.Invoice', function() {
	return {
		extend: 'Ext.app.Controller',
		
		requires: ['NP.core.Config'],
		
		views: [
			'invoice.Register'
			,'invoice.View'
			,'invoice.Lines'
		],
		models: [
			'Invoice'
			,'InvoiceItem'
			,'PNUniversalField'
			,'PurchaseOrder'
		],
		stores: [
			'InvoiceRegisterOpen'
			,'InvoiceRegisterRejected'
			,'InvoiceLines'
			,'InvoiceForwards'
			,'PNUniversalFields'
		],
		
		init: function() {
			Ext.log('Invoice.init() running');
			
			this.control({
				'#invoiceRegisterTabs': {
					tabchange: onTabChange
				},
				'registeropeninvoice': {
					itemclick: function(gridView, record, item, index, e, eOpts) {
						this.application.addHistory( 'Invoice:showView:' + record.get('invoice_id') );
					}
				}
			});
		},
		
		showRegister: function(activeTab) {
			// If no active tab is passed, default to Open
			if (!activeTab) var activeTab = 'open';
			
			// If the invoice register is not active, create the view and put it in the main content panel
			if (this.application.getCurrentView().xtype != 'invoiceRegister') {
				var vw = this.getView('invoice.Register').create();
				this.application.setView(vw);
			}
			
			// Check if the tab to be selected is already active, if it isn't make it the active tab
			var tab = Ext.ComponentQuery.query('#'+activeTab+'InvList')[0];
			var tabPanel = Ext.ComponentQuery.query('#invoiceRegisterTabs')[0];
			
			if (tab.itemId != tabPanel.getActiveTab().itemId) {
				tabPanel.setActiveTab(tab);
			}
			
			if (activeTab == 'open') {
				this.getStore('InvoiceRegisterOpen').load();
			} else if (activeTab == 'rejected') {
				this.getStore('InvoiceRegisterRejected').load();
			}
		},
		
		showView: function(invoice_id) {
			Ext.log('Invoice.showView('+invoice_id+') running');
			
			var vw = this.getView('invoice.View').create();
			
			var app = this.application;
			var ctler = this;
			
			// Load everything needed to display the invoice view before showing it
			app.getModel('Invoice').load(invoice_id, {
				success: function(invoiceRec) {
					app.remoteCall({
						requests: [
							// This request gets the accounting period for the current property
							{
								service: 'property.PropertyService', 
								action: 'getAccountingPeriod',
								property_id: invoiceRec.get('property_id')
							},
							// This request gets the associated POs for this invoice
							{ 
								service: 'invoice.InvoiceService', 
								action: 'getAssociatedPOs',
								invoice_id: invoiceRec.getId(),
								model: 'NP.model.PurchaseOrder'
							}
						],
						success: function(results) {
							var current_period = results[0], associatedPOStore = results[1];
							
							// Set the invoice title to show the correct status
							var subVw = Ext.ComponentQuery.query('#invoiceViewTitle')[0];
							subVw.setTitle('Invoice: ' + invoiceRec.getFormattedStatus());
							
							// Build the header panel
							var periods = getPeriods(current_period);
							var headerVw = Ext.ComponentQuery.query('invoiceHeader')[0];
							headerVw.buildView(invoiceRec, periods.startDate, periods.endDate, associatedPOStore);
					
							// Build the custom field panel
							var customFieldVw = Ext.ComponentQuery.query('invoiceCustom')[0];
							customFieldVw.buildView('header', 'inv', invoiceRec);
							
							// Load the line grid store
							var lineStore = app.getStore('InvoiceLines');
							var lineTable = Ext.ComponentQuery.query('invoiceLineTable')[0];
							lineStore.load({
								params: { invoice_id: invoice_id },
								callback: function() {
									lineTable.buildView(invoiceRec, lineStore);
								}
							});
							
							// Load the forward grid store
							var forwardGrid = Ext.ComponentQuery.query('invoiceForwards')[0];
							var forwardStore = forwardGrid.getStore();
							
							forwardStore.load({ params: { invoice_id: invoice_id }});
							
							// Get the form panel and load the record
							var mainVw = Ext.ComponentQuery.query('invoiceView')[0];
							mainVw.getForm().loadRecord(invoiceRec);
							
							var periodCombo = Ext.ComponentQuery.query('#invoice_period');
							if (periodCombo.length) {
								periodCombo[0].setValue(Ext.Date.format(invoiceRec.get('invoice_period'), 'm/d/Y'));
							}
							
							// Only show the main view once everything else has been loaded
							app.setView(vw);
						}
					});
				}
			});
		}
	}
	
	function onTabChange(tabPanel, newCard, oldCard, eOpts) {
		Ext.log('Invoice.onTabChange() running');
		
		var activeTab = tabPanel.activeTab.itemId.replace('InvList', '');
		this.application.addHistory('Invoice:showRegister:' + activeTab);
	}
	
	// This function figures out which periods to start and end on for the period combo box
	function getPeriods(currentPeriod, callback) {
		var startDate, endDate, periodObj = new Date(currentPeriod);
		var invoice_post_date_back = NP.core.Config.getSetting('CP.invoice_post_date_back');
		if (invoice_post_date_back > 0) {
			invoice_post_date_back *= -1;
			startDate = Ext.Date.add(periodObj, Ext.Date.MONTH, invoice_post_date_back);
		} else {
			startDate = currentPeriod;
		}
		var invoice_post_date_forward = NP.core.Config.getSetting('CP.invoice_post_date_forward');
		if (invoice_post_date_forward > 0) {
			endDate = Ext.Date.add(periodObj, Ext.Date.MONTH, invoice_post_date_forward);
		} else {
			endDate = currentPeriod;
		}
		
		return { startDate: startDate, endDate: endDate };
	}
});