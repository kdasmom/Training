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
                                
			// Clicking on the Administration > GL Account Setup menu
			'#glaccountSetupMenuBtn': {
				click: function() {
					this.addHistory('GLAccountSetup:showGLAccountSetup');
				}
			},
			
            // Clicking on Import/Export Utility or any of the subitems under Import/Export Utility
            '#importMenuBtn,#importMenuBtn menuitem': {
                    click: function(itemClicked) {
                            var token = 'Import:showImport';
                            if (itemClicked.itemId != 'importMenuBtn') {
                                    token += ':' + itemClicked.itemId.replace('ImportMenuBtn', '');
                            } else {
                                    token += ':overview';
                            }
                            this.addHistory(token);
                    }
            },

            // Clicking on the Administration > System Setup menu
            '#budgetOverageMenuBtn': {
                click: function() {
                    this.addHistory('BudgetOverage:showBudgetOverage');
                }
            },
            
            '#utilitySetupMenuBtn': {
                click: function() {
                    this.addHistory('UtilitySetup:showUtilGrid');
                }
            },

			// Clicking on the Administration > System Setup menu
			'#mobileSetupMenuBtn': {
				click: function() {
					this.addHistory('MobileSetup:showMobileInfoGrid');
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

		function renderDashboard(useSummaryStatOnBlank) {
			// Get the user's dashboard layout
			var userprofile_dashboard_layout = NP.Security.getUser().get('userprofile_dashboard_layout');
			// If the layout has been setup and is not blank, render it
			if (userprofile_dashboard_layout !== null) {
				that.renderCanvas(Ext.JSON.decode(userprofile_dashboard_layout));
			// If it's blank, try to use the default summary stat that they log into instead
			// (the useSummaryStatOnBlank is to prevent infinite loops)
			} else if(useSummaryStatOnBlank) {
				renderDefaultSummaryStat();
			// If we're skipping the default summary stat, last option is to try to display the first summary stat available
			} else {
				var userStats = NP.lib.core.SummaryStatManager.getStats();
				for (var cat in userStats) {
					if (userStats[cat].length) {
						that.selectSummaryStat(userStats[cat][0]['name']);
						break;
					}
				}
			}
		}

		function renderDefaultSummaryStat() {
			var user = NP.Security.getUser();
			var defaultDash = user.get('userprofile_default_dashboard');
			if (defaultDash === null) {
				renderDashboard(false);
			// Otherwise they want to see the summary stat they selected
			} else {
				// Get the summary stat record
				var rec = Ext.getStore('system.SummaryStats').findRecord('id', defaultDash, 0, false, false, true);

				// If the summary stat is valid and the user has access to it, show it
				if (rec && rec.get('module_id') in NP.Security.getPermissions()) {
					that.selectSummaryStat(rec.get('name'));
				// If for some reason that summary stat isn't valid (stat they no longer have access to, for example)
				// just show their default dashboard
				} else {
					renderDashboard(false);
				}
			}
		}

		// Setup the Home view
		this.setView('NP.view.viewport.Home');
		// If a summary stat is being passed to the controller, select it
		if (arguments.length == 1) {
			// If the summaryStatName is set to dashboard, that's a special stat to display the customizable dashboard
			if (summaryStatName == 'dashboard') {
				renderDashboard(true);
			// Otherwise we just want to display a summary stat
			} else {
				this.selectSummaryStat(summaryStatName);
			}
		// If no summary stat is being passed, we assume we're dealing with user who's seeing the home page when logging in
		} else {
			renderDefaultSummaryStat();
		}
	},

	renderCanvas: function(config) {
		// Set the canvas to the detail panel
		this.setView('NP.view.shared.PortalCanvas', {
			border     : false,
			viewOnly   : true,
			buildConfig: config,
			permissions: NP.Security.getPermissions()
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