/**
 * The Viewport controller deals with operations for the home page, as well as the top part of
 * the screen (menu, top toolbar, logo, etc.)
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.Viewport', {
	extend: 'Ext.app.Controller',
	
	requires: ['NP.lib.core.Security','NP.lib.core.SummaryStatManager'],
	
	stores: ['user.Properties','user.Regions','user.Delegations'],
	
	init: function() {
		var that = this;
		
		// Shortcut private function to open an invoice
		function openInvoice(invoice_id) {
			that.application.addHistory('Invoice:showView:' + invoice_id);
		}

		// Define event handlers
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

			// Runs after Home panel has been rendered
			'[xtype="viewport.home"]': {
				afterrender: function() {
					// Trigger the change event on the Context Picker to get the dashboard initialized
					Ext.ComponentQuery.query('#homeContextPicker')[0].triggerChangeEvent();
				}
			},

			// Runs when the context picker is changed
			'#homeContextPicker': {
				change: function(toolbar, filterType, selected) {
					// Update the summary stat counts
					NP.lib.core.SummaryStatManager.updateCounts(filterType, selected);

					// Reload the grid for the summary stat currently selected
					this.loadSummaryStatGrid();
				}
			},

			// Runs when a summary stat summary is clicked
			'[xtype="viewport.summarystatlist"]': {
				click: function(rec) {
					this.application.addHistory('Viewport:home:' + rec.get('name'));
				}
			},

			// Runs when a row in one of these grids is clicked
			'[xtype="viewport.dashboard.invoicesopen"],[xtype="viewport.dashboard.invoicesonhold"],\
			 [xtype="viewport.dashboard.invoicescompleted"],[xtype="viewport.dashboard.invoicesbyuser"],\
			 [xtype="viewport.dashboard.invoicesrejected"]': {
				itemclick: function(grid, rec, item, index, e, eOpts) {
					// Only open the invoice if we're not clicking on a checkbox
					if ( !Ext.get(e.getTarget()).hasCls('x-grid-row-checker') ) {
						openInvoice(rec.get('invoice_id'));
					}
                }
			}
		});

		// Listen to the SummaryStatManager for updates to the dashboard counts (can't do this in control()
		// function because SummaryStatManager isn't a component)
        NP.lib.core.SummaryStatManager.addListener('countreceive', function(name, total) {
        	var listPanel = Ext.ComponentQuery.query('[xtype="viewport.summarystatlist"]')[0];
        	listPanel.updateStatCount(name, total);
        });
	},
	
	/**
	 * Shows the home page
	 * @param {String} [summaryStatName] Optional name of a summary stat to show opened
	 */
	home: function(summaryStatName) {
		// Setup the Home view
		this.application.setView('NP.view.viewport.Home');
		// If a summary stat is being passed to the controller, select it
		if (arguments.length == 1) {
			this.selectSummaryStat(summaryStatName);
		// Otherwise just clear the summarystat panel
		} else {
			var detailPanel = Ext.ComponentQuery.query('[xtype="viewport.summarydetailpanel"]')[0];
			detailPanel.removeAll();
		}
	},

	/**
	 * Shows the home page
	 * @private
	 * @param {String} [summaryStatName] Optional name of a summary stat to show opened
	 */
	selectSummaryStat: function(name) {
		Ext.log('Selecting summary stat: ' + name);

		var rec = NP.lib.core.SummaryStatManager.getStat(name);

		var detailPanel = Ext.ComponentQuery.query('[xtype="viewport.summarydetailpanel"]')[0];
		detailPanel.removeAll();
		
		var store = Ext.create('NP.store.invoice.Invoice', {
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
			paging       : true,
			stateful     : true,
			stateId      : 'dashboard_' + rec.get('name')
		});
		
		detailPanel.add(grid);
		
		this.loadSummaryStatGrid();
	},

	/**
	 * Reloads the currently active summary stat grid (if any), moving it back to the first page
	 * @private
	 */
	loadSummaryStatGrid: function() {
		var state = Ext.ComponentQuery.query('#homeContextPicker')[0].getState();
		var summaryStatGrid = Ext.ComponentQuery.query('[xtype="viewport.summarydetailpanel"]')[0].child();
		if (summaryStatGrid) {
			summaryStatGrid.addExtraParams({
				contextType     : state.type,
				contextSelection: state.selected
			});

			summaryStatGrid.reloadFirstPage();
		}
	}
});