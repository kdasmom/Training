Ext.define('NP.controller.Invoice', function() {
	var invoiceRecord;
	 
	return {
		extend: 'Ext.app.Controller',
		
		requires: ['NP.lib.core.Config'],
		
		models: [
			'invoice.Invoice'
			,'invoice.InvoiceItem'
			,'PNUniversalField'
			,'PurchaseOrder'
		],
		stores: [
			'invoice.Register'
			,'invoice.Lines'
			,'invoice.Forwards'
			,'PNUniversalFields'
		],
		
		init: function() {
			var app = this.application;

			this.control({
				'#invoiceRegisterTabs': {
					tabchange: onTabChange
				},
				'registeropeninvoice': {
					itemclick: function(gridView, record, item, index, e, eOpts) {
						this.application.addHistory( 'Invoice:showView:' + record.get('invoice_id') );
					}
				},
				'invoicelinegrid': {
					itemclick: function(gridView, record, item, index, e, eOpts) {
						// Get the invoice line form and show the panel
						var formPanel = Ext.ComponentQuery.query('invoicelineform')[0];
						formPanel.removeAll();
						formPanel.buildView(invoiceRecord, record);
						formPanel.show();
					}
				},
				'#invoiceLineFormCancelBtn': {
					click: function() {
						var formPanel = Ext.ComponentQuery.query('invoicelineform')[0];
						formPanel.hide();
						formPanel.removeAll();
					}
				},
				'#invoiceRegisterContextPicker': {
					change: function(toolbar, filterType, selected) {
						var contentView = app.getCurrentView();
						// If user picks a different property/region and we're on a register, update the grid
						if (contentView.getXType() == 'invoice.register') {
							var activeTab = contentView.queryById('invoiceRegisterTabs').getActiveTab();
							if (activeTab.getStore) {
								activeTab.getStore().removeAll();
								activeTab.getDockedItems()[0].moveFirst();
							}
						}
					}
				}
			});
		},
		
		showRegister: function(activeTab) {
			// If no active tab is passed, default to Open
			if (!activeTab) var activeTab = 'open';
			
			// If the invoice register is not active, create the view and put it in the main content panel
			if (this.application.getCurrentViewType() != 'invoice.register') {
				this.application.setView('NP.view.invoice.Register');
			}
			
			// Check if the tab to be selected is already active, if it isn't make it the active tab
			var tab = Ext.ComponentQuery.query('#'+activeTab+'InvList')[0];
			var tabPanel = Ext.ComponentQuery.query('#invoiceRegisterTabs')[0];
			
			if (tab.itemId != tabPanel.getActiveTab().itemId) {
				tabPanel.setActiveTab(tab);
			}
			
			if (tab.getStore) {
				var proxy = tab.getStore().getProxy();
				proxy.extraParams.tab = activeTab;
				
				tab.getStore().removeAll();
				tab.getDockedItems()[0].moveFirst();
			}
		},
		
		showView: function(invoice_id) {
			Ext.log('Invoice.showView('+invoice_id+') running');
			
			var vw = Ext.create('NP.view.invoice.View');
			
			var app = this.application;
			var ctler = this;
			
			// Load everything needed to display the invoice view before showing it
			app.getModel('invoice.Invoice').load(invoice_id, {
				success: function(invoiceRec) {
					invoiceRecord = invoiceRec;
					app.remoteCall({
						requests: [
							// This request gets the accounting period for the current property
							{
								service: 'PropertyService', 
								action: 'getAccountingPeriod',
								property_id: invoiceRec.get('property_id')
							},
							// This request gets the associated POs for this invoice
							{ 
								service: 'InvoiceService', 
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
							
							// Load the line grid store
							var lineStore = app.getStore('invoice.Lines');
							var lineGrid = Ext.ComponentQuery.query('invoicelinepanel')[0];
							lineStore.load({
								params: { invoice_id: invoice_id }
							});
					
							// Build the custom field panel
							var customFieldVw = Ext.ComponentQuery.query('invoiceCustom')[0];
							customFieldVw.buildView('header', 'inv', invoiceRec);
							
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
		var invoice_post_date_back = NP.lib.core.Config.getSetting('CP.invoice_post_date_back');
		if (invoice_post_date_back > 0) {
			invoice_post_date_back *= -1;
			startDate = Ext.Date.add(periodObj, Ext.Date.MONTH, invoice_post_date_back);
		} else {
			startDate = currentPeriod;
		}
		var invoice_post_date_forward = NP.lib.core.Config.getSetting('CP.invoice_post_date_forward');
		if (invoice_post_date_forward > 0) {
			endDate = Ext.Date.add(periodObj, Ext.Date.MONTH, invoice_post_date_forward);
		} else {
			endDate = currentPeriod;
		}
		
		return { startDate: startDate, endDate: endDate };
	}
}());