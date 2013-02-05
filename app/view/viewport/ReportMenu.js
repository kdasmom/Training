Ext.define('NP.view.viewport.ReportMenu', {
    extend: 'Ux.ui.HoverButton',
    alias: 'widget.viewport.reportmenu',
    
    requires: ['NP.core.Config','NP.core.Security'],

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
	budgetText        : NP.core.Config.getSetting('pn.budget.BudgetForecastLabel') + 's',
	adminText         : 'Admin Reports',

    menu: {},

    initComponent: function() {
    	this.text = this.reportText;
    	this.menu.showSeparator = false;
    	this.menu.items = [];

	    if ( NP.core.Security.hasPermission(2098) ) {
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
		
		if ( NP.core.Config.getSetting('PN.POOptions.POSwitch') == 1 ) {
			if ( NP.core.Security.hasPermission(1029) ) {
				this.menu.items.push({
					text: this.pOText
				});
			}
			
			if ( NP.core.Security.hasPermission(6040) && NP.core.Config.getSetting('CP.RECEIVING_ON') == 1 ) {
				this.menu.items.push({
					text: this.receiptText
				});
			}
		}
		
		if ( NP.core.Security.hasPermission(1034) ) {
			this.menu.items.push({
				text: this.invoiceText
			});
		}
		
		if ( NP.core.Security.hasPermission(2048) ) {
			this.menu.items.push({
				text: this.jobText
			});
		}
		
		if ( NP.core.Security.hasPermission(1063) ) {
			this.menu.items.push({
				text: this.utilityText
			});
		}
		
		if ( NP.core.Security.hasPermission(2009) ) {
			this.menu.items.push({
				text: this.vendorText
			});
		}
		
		if ( NP.core.Security.hasPermission(1039) ) {
			this.menu.items.push({
				text: this.budgetText
			});
		}
		
		if ( NP.core.Security.hasPermission(1069) ) {
			this.menu.items.push({
				text: this.adminText
			});
		}

	    this.callParent(arguments);
    }
});