/**
 * The Admin menu
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.menu.AdminMenu', {
    extend: 'NP.lib.ui.HoverButton',
    alias: 'widget.viewport.menu.adminmenu',
    
    requires: [
    	'NP.lib.core.Config',
    	'NP.lib.core.Security',
    	'NP.lib.core.Translator'
    ],

	initComponent: function() {
    	this.text = NP.Translator.translate('Administration');
		this.menu = {
			showSeparator: false,
			items: [
				// My Settings
				{
					itemId: 'mySettingsMenuBtn',
					text: NP.Translator.translate('My Settings')
				}
			]
		};

		// User Manager
	    if ( NP.lib.core.Security.hasPermission(4) ) {
			this.menu.items.push({
				itemId: 'userManagerMenuBtn',
				text: NP.Translator.translate('User Manager')
			});
		}
		
		// Message Center
		if ( NP.lib.core.Security.hasPermission(6091) ) {
			this.menu.items.push({
				itemId: 'messageCenterMenuBtn',
				text: NP.Translator.translate('Message Center')
			});
		}
		// Integration
		if ( NP.lib.core.Security.hasPermission(6047) ) {
			this.menu.items.push({
				text: NP.Translator.translate('Integration')
			});
		}
		
		// Property Setup
		if ( NP.lib.core.Security.hasPermission(12) ) {
			this.menu.items.push({
				itemId: 'propertySetupMenuBtn',
				text: NP.Translator.translate('{property} Setup', { property: NP.Config.getPropertyLabel() })
			});
		}
		
		// System Setup
		if ( NP.lib.core.Security.hasPermission(1066) ) {
			this.menu.items.push({
				itemId: 'systemSetupMenuBtn',
				text: NP.Translator.translate('System Setup')
			});
		}
		
		// GL Account Setup
		if ( NP.lib.core.Security.hasPermission(6014) ) {
			this.menu.items.push({
				text: NP.Translator.translate('GL Account Setup')
			});
		}
		
		// Catalog Maintenance
		if ( NP.lib.core.Security.hasPermission(6066) && NP.lib.core.Config.getSetting('VC_isOn') == 1 ) {
			this.menu.items.push({
				itemId: 'catalogMaintenanceMenuBtn',
				text: NP.Translator.translate('Catalog Maintenance')
			});
		}
		
		if ( NP.lib.core.Security.hasPermission(6015) ) {
			var subsection = {
				// Import/Export Utility
				itemId: 'importMenuBtn',
				text: NP.Translator.translate('Import/Export Utility'),
				menu: {
					showSeparator: false,
					items: [{
						// Overview
						itemId: 'overviewImportMenuBtn',
						text: NP.Translator.translate('Overview')
					}]
				}
			};
			
			// GL
			if ( NP.lib.core.Security.hasPermission(6016) ) {
				subsection.menu.items.push({
					itemId: 'glImportMenuBtn',
					text: NP.Translator.translate('GL')
				});
			}

			// Property
			if ( NP.lib.core.Security.hasPermission(6017) ) {
				subsection.menu.items.push({
					itemId: 'propertyImportMenuBtn',
					text: NP.Config.getPropertyLabel()
				});
			}
			
			// Vendor
			if ( NP.lib.core.Security.hasPermission(6018) ) {
				subsection.menu.items.push({
					itemId: 'vendorImportMenuBtn',
					text: NP.Translator.translate('Vendor')
				});
			}
			
			// Invoice
			if ( NP.lib.core.Security.hasPermission(6019) ) {
				subsection.menu.items.push({
					itemId: 'invoiceImportMenuBtn',
					text: NP.Translator.translate('Invoice')
				});
			}
			
			// User
			if ( NP.lib.core.Security.hasPermission(6020) ) {
				subsection.menu.items.push({
					itemId: 'userImportMenuBtn',
					text: NP.Translator.translate('User')
				});
			}
			
			// Custom Field
			if ( NP.lib.core.Security.hasPermission(6021) ) {
				subsection.menu.items.push({
					itemId: 'customFieldImportMenuBtn',
					text: NP.Translator.translate('Custom Field')
				});
			}
			
			// Splits
			subsection.menu.items.push({
				itemId: 'splitsImportMenuBtn',
				text: NP.Translator.translate('Splits')
			});
			
			this.menu.items.push(subsection);
		}
		
		// Set Approval Budget Overage
		if ( NP.lib.core.Security.hasPermission(1043) ) {
			this.menu.items.push({
                itemId: 'budgetOverageMenuBtn',
				text: NP.Translator.translate('Set Approval Budget Overage')
			});
		}
		
		// Utility Setup
		if ( NP.lib.core.Security.hasPermission(1057) ) {
			this.menu.items.push({
                itemId: 'utilitySetupMenuBtn',
				text: NP.Translator.translate('Utility Setup')
			});
		}
		
		// Will need to add condition here to only show for admin users
		Ext.log('Need to modify to only show Mobile Setup to admin users');
		this.menu.items.push({
            itemId: 'mobileSetupMenuBtn',
			text: NP.Translator.translate('Mobile Setup')
		});

	    this.callParent(arguments);
    }
});