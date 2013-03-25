/**
 * The Reports menu
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.menu.ReportMenu', {
    extend: 'NP.lib.ui.HoverButton',
    alias: 'widget.viewport.menu.reportmenu',
    
    requires: ['NP.lib.core.Config','NP.lib.core.Security'],

	reportText        : 'Reports',
	customText        : 'Custom Reports',
	customOverviewText: 'Overview',
	customSystemText  : 'System Saved Reports',
	customMyText      : 'My Saved Reports',
	pOText            : 'PO Register Reports',
	receiptText       : 'Receipt Reports',
	invoiceText       : 'Invoice Register Reports',
	jobText           : 'Job Costing Reports',
	utilityText       : 'Utility Reports',
	vendorText        : 'Vendor History Reports',
	budgetText        : NP.lib.core.Config.getSetting('pn.budget.BudgetForecastLabel') + 's',
	adminText         : 'Admin Reports',

    menu: {},

    initComponent: function() {
    	this.text = this.reportText;
    	this.menu.showSeparator = false;
    	this.menu.items = [];

    	// Custom Reports
	    if ( NP.lib.core.Security.hasPermission(2098) ) {
			this.menu.items.push({
				text: this.customText,
				menu: {
					showSeparator: false,
					items: [
						{ text: this.customOverviewText },
						{ text: this.customSystemText },
						{ text: this.customMyText }
					]
				}
			});
		}
		
		if ( NP.lib.core.Config.getSetting('PN.POOptions.POSwitch') == 1 ) {
			// PO Register Reports
			if ( NP.lib.core.Security.hasPermission(1029) ) {
				this.menu.items.push({
					text: this.pOText
				});
			}
			
			// Receipt Reports
			if ( NP.lib.core.Security.hasPermission(6040) && NP.lib.core.Config.getSetting('CP.RECEIVING_ON') == 1 ) {
				this.menu.items.push({
					text: this.receiptText
				});
			}
		}
		
		// Invoice Reports
		if ( NP.lib.core.Security.hasPermission(1034) ) {
			this.menu.items.push({
				text: this.invoiceText
			});
		}
		
		// Job Costing Reports
		if ( NP.lib.core.Security.hasPermission(2048) ) {
			this.menu.items.push({
				text: this.jobText
			});
		}
		
		// Utility Reports
		if ( NP.lib.core.Security.hasPermission(1063) ) {
			this.menu.items.push({
				text: this.utilityText
			});
		}
		
		// Vendor History Reports
		if ( NP.lib.core.Security.hasPermission(2009) ) {
			this.menu.items.push({
				text: this.vendorText
			});
		}
		
		// Budget Forecast Reports
		if ( NP.lib.core.Security.hasPermission(1039) ) {
			this.menu.items.push({
				text: this.budgetText
			});
		}
		
		// Admin Reports
		if ( NP.lib.core.Security.hasPermission(1069) ) {
			this.menu.items.push({
				text: this.adminText
			});
		}

	    this.callParent(arguments);
    }
});