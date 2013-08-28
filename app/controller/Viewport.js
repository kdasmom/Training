/**
 * The Viewport controller deals with operations for the home page, as well as the top part of
 * the screen (menu, top toolbar, logo, etc.)
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.Viewport', {
	extend: 'NP.lib.core.AbstractController',
	
	requires: [
		'NP.lib.core.Security',
		'NP.lib.core.Config',
		'NP.lib.core.SummaryStatManager',
		'NP.view.shared.PortalCanvas'
	],
	
	refs: [
		{ ref: 'contextPicker', selector: '#homeContextPicker' }
	],

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
					this.addHistory('Viewport:home:dashboard');
				},
				// Clicking on the Home link in the header top right
				nphomelinkclick: function() {
					this.addHistory('Viewport:home:dashboard');
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
					this.getContextPicker().triggerChangeEvent(true);
				}
			},

			// Runs when the context picker is changed
			'#homeContextPicker': {
				change: function(toolbar, filterType, selected, initCall) {
					var property_id = this.getContextPicker().propertyCombo.getValue();
					// Update the summary stat counts
					NP.lib.core.SummaryStatManager.updateCounts(filterType, selected, property_id, initCall);
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
	},
	
	/**
	 * Shows the home page
	 * @param {String} [summaryStatName] Optional name of a summary stat to show opened
	 */
	home: function(summaryStatName) {
		var that = this;

		function renderDashboard() {
			var config = NP.Security.getUser().get('userprofile_dashboard_layout');
			if (config !== null) {
				that.renderCanvas(Ext.JSON.decode(config));
			}
		}

		// Setup the Home view
		this.setView('NP.view.viewport.Home');
		// If a summary stat is being passed to the controller, select it
		if (arguments.length == 1) {
			if (summaryStatName == 'dashboard') {
				renderDashboard();
			} else {
				this.selectSummaryStat(summaryStatName);
			}
		} else {
			var user = NP.Security.getUser();
			var defaultDash = user.get('userprofile_default_dashboard');
			if (defaultDash === null) {
				renderDashboard();
			} else {
				var rec = Ext.getStore('system.SummaryStats').findRecord('id', defaultDash, 0, false, false, true);

				if (rec) {
					this.selectSummaryStat(rec.get('name'));
				} else {
					renderDashboard();
				}
			}
		}
	},

	renderCanvas: function(config) {
		// Set the canvas to the detail panel
		this.setView('NP.view.shared.PortalCanvas', {
			border     : false,
			viewOnly   : true,
			buildConfig: config
		}, '[xtype="viewport.summarydetailpanel"]', true);
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

		this.renderCanvas(rec.get('config'));
	}
});