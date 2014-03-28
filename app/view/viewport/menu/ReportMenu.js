/**
 * The Reports menu
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.menu.ReportMenu', {
    extend: 'NP.lib.ui.HoverButton',
    alias: 'widget.viewport.menu.reportmenu',
    
    requires: [
    	'NP.lib.core.Config',
    	'NP.lib.core.Security',
    	'NP.lib.core.Translator'
    ],

	menu: {},

    initComponent: function() {
    	this.text = NP.Translator.translate('Reports');
    	this.menu.showSeparator = false;
    	this.menu.items = [];

    	// Custom Reports
	    if ( NP.lib.core.Security.hasPermission(2098) ) {
			this.menu.items.push({
				text: NP.Translator.translate('Custom Reports'),
				menu: {
					showSeparator: false,
					items: [
						{ text: NP.Translator.translate('Overview') },
						{ text: NP.Translator.translate('System Saved Reports') },
						{ text: NP.Translator.translate('My Saved Reports') }
					]
				}
			});
		}
		
		if ( NP.lib.core.Config.getSetting('PN.POOptions.POSwitch') == 1 ) {
			// PO Register Reports
			if ( NP.lib.core.Security.hasPermission(1029) ) {
				this.menu.items.push({
					text: NP.Translator.translate('PO Register Reports')
				});
			}
			
			// Receipt Reports
			if ( NP.lib.core.Security.hasPermission(6040) && NP.lib.core.Config.getSetting('CP.RECEIVING_ON') == 1 ) {
				this.menu.items.push({
					text: NP.Translator.translate('Receipt Reports')
				});
			}
		}
		
		// Invoice Reports
		if ( NP.lib.core.Security.hasPermission(1034) ) {
			this.menu.items.push({
				itemId: 'invoiceReportMenuBtn',
				text  : NP.Translator.translate('Invoice Register Reports')
			});
		}
		
		// Job Costing Reports
		if ( NP.lib.core.Security.hasPermission(2048) ) {
			this.menu.items.push({
				text: NP.Translator.translate('Job Costing Reports')
			});
		}
		
		// Utility Reports
		if ( NP.lib.core.Security.hasPermission(1063) ) {
			this.menu.items.push({
				text: NP.Translator.translate('Utility Reports')
			});
		}
		
		// Vendor History Reports
		if ( NP.lib.core.Security.hasPermission(2009) ) {
			this.menu.items.push({
				text: NP.Translator.translate('Vendor History Reports')
			});
		}
		
		// Budget Forecast Reports
		if ( NP.lib.core.Security.hasPermission(1039) ) {
			this.menu.items.push({
				text: NP.lib.core.Config.getSetting('pn.budget.BudgetForecastLabel')
			});
		}
		
		// Admin Reports
		if ( NP.lib.core.Security.hasPermission(1069) ) {
			this.menu.items.push({
				text: NP.Translator.translate('Admin Reports')
			});
		}

	    this.callParent(arguments);
    }
});