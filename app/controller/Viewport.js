Ext.define('NP.controller.Viewport', function() {
	return {
		extend: 'Ext.app.Controller',
		
		requires: ['NP.lib.core.Security','NP.lib.core.SummaryStatManager'],
		
		stores: ['user.Properties','user.Regions','user.Delegations'],
		
		init: function() {
			var that = this;
			
			function openInvoice(invoice_id) {
				that.application.addHistory('Invoice:showView:' + invoice_id);
			}

			this.control({
				// Clicking on the NexusPayables logo
				'viewport': {
					npLogoClicked: function() {
						this.application.addHistory('Viewport:home');
					}
				},

				// Clicking on Invoices, Invoice Register, or any of the subitems under Invoice Register
				'viewport #invMenuBtn,viewport #invRegisterMenuBtn,viewport #invRegisterMenuBtn menuitem': {
					click: function(itemClicked) {
						var token = 'Invoice:showRegister';
						if (itemClicked.itemId != 'invMenuBtn' && itemClicked.itemId != 'invRegisterMenuBtn') {
							token += ':' + itemClicked.itemId.replace('InvRegisterMenuBtn', '');
						} else {
							token += ':open';
						}
						this.application.addHistory(token);
					}
				},

				'#homePanel': {
					afterrender: function() {
						Ext.ComponentQuery.query('#homeContextPicker')[0].triggerChangeEvent();
					}
				},

				// Making a change to the context picker
				'#homeContextPicker': {
					change: function(toolbar, filterType, selected) {
						NP.lib.core.SummaryStatManager.updateCounts(filterType, selected);
					}
				},

				// Clicking on a summary stat
				'[xtype="viewport.summarystatlist"]': {
					click: function(rec) {
						this.application.addHistory('Viewport:home:' + rec.get('name'));
					}
				},

				'[xtype="viewport.dashboard.invoicestoapprove"]': {
					itemclick: function(grid, rec) {
                        openInvoice(rec.get('invoice_id'));
                    }
				},

				'[xtype="viewport.dashboard.invoicesonhold"]': {
					itemclick: function(grid, rec) {
                        openInvoice(rec.get('invoice_id'));
                    }
				},

				'[xtype="viewport.dashboard.invoicescompleted"]': {
					itemclick: function(grid, rec, item, index, e, eOpts) {
						// Only open the invoice if we're not clicking on the checkbox
						if ( !Ext.get(e.getTarget()).hasCls('x-grid-row-checker') ) {
							openInvoice(rec.get('invoice_id'));
						}
                    }
				},

				'[xtype="viewport.dashboard.invoicesbyuser"]': {
					itemclick: function(grid, rec) {
                        openInvoice(rec.get('invoice_id'));
                    }
				}
			});
		},
		
		home: function(name) {
			// Setup the Home view
			this.application.setView('NP.view.viewport.Home');
			// If a summary stat is being passed to the controller, select it
			if (arguments.length == 1) {
				this.selectSummaryStat(name);
			// Otherwise just clear the summarystat panel
			} else {
				var detailPanel = Ext.ComponentQuery.query('#summaryStatDetailPanel')[0];
				detailPanel.removeAll();
			}
		},

		selectSummaryStat: function(name) {
			Ext.log('Selecting summary stat: ' + name);

			var rec = NP.lib.core.SummaryStatManager.getStat(name);

			var detailPanel = Ext.ComponentQuery.query('#summaryStatDetailPanel')[0];
			detailPanel.removeAll();
			
			var store = Ext.create('NP.lib.data.Store', {
				model      : 'NP.model.' + rec.get('model'),
				service    : 'UserService',
				action     : 'getDashboardStat',
				paging     : true,
				extraParams: {
					statService: rec.get('service'),
					stat       : rec.get('name'),
					countOnly  : false
				}
			});

			var grid = Ext.create('NP.view.viewport.dashboard.'+rec.get('name'), {
				title        : rec.get('title'),
				store        : store,
				contextPicker: 'homeContextPicker',
				paging       : true,
				stateful     : true,
				stateId      : 'dashboard_' + rec.get('name')
			});
			
			detailPanel.add(grid);
			
			grid.getStore().load();
		}
	}
}());