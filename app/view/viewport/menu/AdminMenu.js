/**
 * The Admin menu
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.menu.AdminMenu', {
    extend: 'NP.lib.ui.HoverButton',
    alias: 'widget.viewport.menu.adminmenu',
    
    requires: ['NP.lib.core.Config','NP.lib.core.Security'],

	adminText          : 'Administration',
	mySettingsText     : 'My Settings',
	userText           : 'User Manager',
	messageText        : 'Message Center',
	integrationText    : 'Integration',
	propertyText       : NP.lib.core.Config.getSetting('PN.main.PropertyLabel', 'Property') + ' Setup',
	systemText         : 'System Setup',
	gLText             : 'GL Account Setup',
	catalogText        : 'Catalog Maintenance',
	importText         : 'Import/Export Utility',
	importOverviewText : 'Overview',
	importGLText       : 'GL',
	importPropertyText : NP.lib.core.Config.getSetting('PN.main.PropertyLabel', 'Property'),
	importVendorText   : 'Vendor',
	importInvoiceText  : 'Invoice',
	importUserText     : 'User',
	importCustomText   : 'Custom Field',
	importSplitsText   : 'Splits',
	approvalBudgetsText: 'Set Approval Budget Overage',
	utilityText        : 'Utility Setup',
	mobileText         : 'Mobile Setup',

    initComponent: function() {
    	this.text = this.adminText;
		this.menu = {
			showSeparator: false,
			items: [
				// My Settings
				{
					itemId: 'mySettingsMenuBtn',
					text: this.mySettingsText
				}
			]
		};
                			
		// User Manager
                if ( NP.lib.core.Security.hasPermission(4) ) {
			this.menu.items.push({
				itemId: 'userManagerMenuBtn',
				text: this.userText
			});
		}
		
		// Message Center
		if ( NP.lib.core.Security.hasPermission(6091) ) {
			this.menu.items.push({
				itemId: 'messageCenterMenuBtn',
				text: this.messageText
			});
		}
		// Integration
		if ( NP.lib.core.Security.hasPermission(6047) ) {
			this.menu.items.push({
				text: this.integrationText
			});
		}
		
		// Property Setup
		if ( NP.lib.core.Security.hasPermission(12) ) {
			this.menu.items.push({
				itemId: 'propertySetupMenuBtn',
				text: this.propertyText
			});
		}
		
		// System Setup
		if ( NP.lib.core.Security.hasPermission(1066) ) {
			this.menu.items.push({
				itemId: 'systemSetupMenuBtn',
				text: this.systemText
			});
		}
		
		// GL Account Setup
		if ( NP.lib.core.Security.hasPermission(6014) ) {
			this.menu.items.push({
				text: this.gLText
			});
		}
		
		// Catalog Maintenance
		if ( NP.lib.core.Security.hasPermission(6066) && NP.lib.core.Config.getSetting('VC_isOn') == 1 ) {
			this.menu.items.push({
				itemId: 'catalogMaintenanceMenuBtn',
				text: this.catalogText
			});
		}
		
		if ( NP.lib.core.Security.hasPermission(6015) ) {
			var subsection = {
				// Import/Export Utility
				itemId: 'importMenuBtn',
				text: this.importText,
				menu: {
					showSeparator: false,
					items: [{
						// Overview
						itemId: 'overviewImportMenuBtn',
						text: this.importOverviewText
					}]
				}
			};
			
			// GL
			if ( NP.lib.core.Security.hasPermission(6016) ) {
				subsection.menu.items.push({
					itemId: 'glImportMenuBtn',
					text: this.importGLText
				});
			}

			// Property
			if ( NP.lib.core.Security.hasPermission(6017) ) {
				subsection.menu.items.push({
					itemId: 'propertyImportMenuBtn',
					text: this.importPropertyText
				});
			}
			
			// Vendor
			if ( NP.lib.core.Security.hasPermission(6018) ) {
				subsection.menu.items.push({
					itemId: 'vendorImportMenuBtn',
					text: this.importVendorText
				});
			}
			
			// Invoice
			if ( NP.lib.core.Security.hasPermission(6019) ) {
				subsection.menu.items.push({
					itemId: 'invoiceImportMenuBtn',
					text: this.importInvoiceText
				});
			}
			
			// User
			if ( NP.lib.core.Security.hasPermission(6020) ) {
				subsection.menu.items.push({
					itemId: 'userImportMenuBtn',
					text: this.importUserText
				});
			}
			
			// Custom Field
			if ( NP.lib.core.Security.hasPermission(6021) ) {
				subsection.menu.items.push({
					itemId: 'customFieldImportMenuBtn',
					text: this.importCustomText
				});
			}
			
			// Splits
			subsection.menu.items.push({
				itemId: 'splitsImportMenuBtn',
				text: this.importSplitsText
			});
                        
			this.menu.items.push(subsection);
		}
		
		// Set Approval Budget Overage
		if ( NP.lib.core.Security.hasPermission(1043) ) {
			this.menu.items.push({
                itemId: 'budgetOverageMenuBtn',
				text: this.approvalBudgetsText
			});
		}
		
		// Utility Setup
		if ( NP.lib.core.Security.hasPermission(1057) ) {
			this.menu.items.push({
				text: this.utilityText
			});
		}
		
		// Will need to add condition here to only show for admin users
		Ext.log('Need to modify to only show Mobile Setup to admin users');
		this.menu.items.push({
			text: this.mobileText
		});

	    this.callParent(arguments);
    }
});