/**
 * The Viewport controller deals with operations for the home page, as well as the top part of
 * the screen (menu, top toolbar, logo, etc.)
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.Viewport', {
	extend: 'NP.lib.core.AbstractController',
	
	requires: ['NP.lib.core.Security','NP.lib.core.SummaryStatManager'],
	
	init: function() {
		var that = this;
		
		// Shortcut private function to open an invoice
		function openInvoice(invoice_id) {
			that.addHistory('Invoice:showView:' + invoice_id);
		}

		// Define event handlers
		this.control({
			'viewport': {
				// Clicking on the NexusPayables logo
				nplogoclicked: function() {
					this.addHistory('Viewport:home');
				},
				// Clicking on the Home link in the header top right
				nphomelinkclick: function() {
					this.addHistory('Viewport:home');
				},
				// Clicking on the Logout link in the header top right
				nplogoutlink: function() {
					NP.Security.logout(function() { window.location = 'login.php'; });
				}
			},

			// Clicking on Invoices, Invoice Register, or any of the subitems under Invoice Register
			'#invMenuBtn,#invRegisterMenuBtn,#invRegisterMenuBtn menuitem': {
				click: function(itemClicked) {
					var token = 'Invoice:showRegister';
					if (itemClicked.itemId != 'invMenuBtn' && itemClicked.itemId != 'invRegisterMenuBtn') {
						token += ':' + itemClicked.itemId.replace('InvRegisterMenuBtn', '');
					} else {
						token += ':open';
					}
					this.addHistory(token);
				}
			},

			// Clicking on the Administration > My Settings menu
			'#mySettingsMenuBtn': {
				click: function() {
					this.addHistory('MySettings:showMySettings');
				}
			},

			// Clicking on the Administraton > User Manager menu
			'#userManagerMenuBtn': {
				click: function() {
					this.addHistory('UserManager:showUserManager');
				}
			},

			// Clicking on the Administration > Message Center menu
			'#messageCenterMenuBtn': {
				click: function() {
					this.addHistory('MessageCenter:showRegister');
				}
			},

			// Clicking on the Administration > My Settings menu
			'#propertySetupMenuBtn': {
				click: function() {
					this.addHistory('PropertySetup:showPropertySetup');
				}
			},

			// Clicking on the Administration > Catalog Maintenance menu
			'#catalogMaintenanceMenuBtn': {
				click: function() {
					this.addHistory('CatalogMaintenance:showRegister');
				}
			},
			
			// Clicking on the Administration > System Setup menu
			'#systemSetupMenuBtn': {
				click: function() {
					this.addHistory('SystemSetup:showSystemSetup');
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
					this.addHistory('Viewport:home:' + rec.get('name'));
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
		this.setView('NP.view.viewport.Home');
		// If a summary stat is being passed to the controller, select it
		if (arguments.length == 1) {
			this.selectSummaryStat(summaryStatName);
		}
	},

	/**
	 * Shows the home page
	 * @private
	 * @param {String} [summaryStatName] Optional name of a summary stat to show opened
	 */
	selectSummaryStat: function(name) {
		Ext.log('Selecting summary stat: ' + name);

		// Make sure the summary stat is selected in the list
		var listPanel = Ext.ComponentQuery.query('[xtype="viewport.summarystatlist"]')[0];
		listPanel.select(name);

		// Get the record for the summary stat
		var rec = NP.lib.core.SummaryStatManager.getStat(name);

		// Create the appropriate store for the summary stat selected
		var store = Ext.create('NP.store.' + rec.get('store'), {
			service    : rec.get('service'),
			action     : 'get' + rec.get('name'),
			paging     : true,
			extraParams: {
				userprofile_id             : NP.lib.core.Security.getUser().get('userprofile_id'),
				delegated_to_userprofile_id: NP.lib.core.Security.getDelegatedToUser().get('userprofile_id'),
				countOnly                  : false
			}
		});

		// Create a grid for the summary stat selected
		var grid = Ext.create('NP.view.viewport.dashboard.'+rec.get('name'), {
			title        : rec.get('title'),
			store        : store,
			paging       : true,
			stateful     : true,
			stateId      : 'dashboard_' + rec.get('name')
		});
		
		// Set the grid to the detail panel
		this.setView(grid, {}, '[xtype="viewport.summarydetailpanel"]');
		
		// Load the store
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