Ext.define('NP.view.viewport.AdminMenu', {
    extend: 'NP.lib.ui.HoverButton',
    alias: 'widget.viewport.adminmenu',
    
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
				{ text: this.mySettingsText }
			]
		};

	    if ( NP.lib.core.Security.hasPermission(4) ) {
			this.menu.items.push({
				text: this.userText
			});
		}
		
		if ( NP.lib.core.Security.hasPermission(6091) ) {
			this.menu.items.push({
				text: this.messageText
			});
		}
		
		if ( NP.lib.core.Security.hasPermission(6047) ) {
			this.menu.items.push({
				text: this.integrationText
			});
		}
		
		if ( NP.lib.core.Security.hasPermission(12) ) {
			this.menu.items.push({
				text: this.propertyText
			});
		}
		
		if ( NP.lib.core.Security.hasPermission(1066) ) {
			this.menu.items.push({
				text: this.systemText
			});
		}
		
		if ( NP.lib.core.Security.hasPermission(6014) ) {
			this.menu.items.push({
				text: this.gLText
			});
		}
		
		if ( NP.lib.core.Security.hasPermission(6066) && NP.lib.core.Config.getSetting('VC_isOn') == 1 ) {
			this.menu.items.push({
				text: this.catalogText
			});
		}
		
		if ( NP.lib.core.Security.hasPermission(6015) ) {
			var subsection = {
				text: this.importText,
				menu: {
					showSeparator: false,
					items: [{
						text: this.importOverviewText
					}]
				}
			};
			
			if ( NP.lib.core.Security.hasPermission(6016) ) {
				subsection.menu.items.push({
					text: this.importGLText
				});
			}
			
			if ( NP.lib.core.Security.hasPermission(6017) ) {
				subsection.menu.items.push({
					text: this.importPropertyText
				});
			}
			
			if ( NP.lib.core.Security.hasPermission(6018) ) {
				subsection.menu.items.push({
					text: this.importVendorText
				});
			}
			
			if ( NP.lib.core.Security.hasPermission(6019) ) {
				subsection.menu.items.push({
					text: this.importInvoiceText
				});
			}
			
			if ( NP.lib.core.Security.hasPermission(6020) ) {
				subsection.menu.items.push({
					text: this.importUserText
				});
			}
			
			if ( NP.lib.core.Security.hasPermission(6021) ) {
				subsection.menu.items.push({
					text: this.importCustomText
				});
			}
			
			subsection.menu.items.push({
				text: this.importSplitsText
			});
			
			this.menu.items.push(subsection);
		}
		
		if ( NP.lib.core.Security.hasPermission(1043) ) {
			this.menu.items.push({
				text: this.approvalBudgetsText
			});
		}
		
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