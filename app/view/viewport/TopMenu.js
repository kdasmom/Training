/**
 * This is the main component for the top menu and includes separate components for each one of the main menu sections
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.TopMenu', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.viewport.topmenu',

    requires: [
    	'NP.lib.core.Security',
    	'NP.view.viewport.menu.VCMenu',
    	'NP.view.viewport.menu.POMenu',
    	'NP.view.viewport.menu.InvoiceMenu',
    	'NP.view.viewport.menu.VendorMenu',
    	'NP.view.viewport.menu.ImageMenu',
    	'NP.view.viewport.menu.BudgetMenu',
    	'NP.view.viewport.menu.ReportMenu',
    	'NP.view.viewport.menu.AdminMenu'
    ],

    dock: 'top',

    itemId: 'viewportTopMenu',

    height: 29,

    style: {
    	background: 'url(resources/images/menu-bar-gradient.gif) repeat-x'
    },

    initComponent: function() {
    	var section, subSection;

    	this.items = [];

	    // Vendor Catalog
	    if ( NP.lib.core.Config.getSetting('VC_isOn') == 1 && NP.lib.core.Security.hasPermission(6067) ) {
			this.items.push({
				xtype: 'viewport.menu.vcmenu',
				itemId: 'vcMenuBtn'
			}, '-');
	    }
	    
	    // Purchase Orders
		if ( NP.lib.core.Config.getSetting('PN.POOptions.POSwitch') == 1 && NP.lib.core.Security.hasPermission(1026) ) {
			this.items.push({
				xtype: 'viewport.menu.pomenu'
			}, '-');
		}
	    
	    // Invoice
	    if ( NP.lib.core.Security.hasPermission(1031) ) {
	    	this.items.push({
				xtype: 'viewport.menu.invoicemenu',
				itemId: 'invMenuBtn'
			}, '-');
		}
		
		// Vendors
		if ( NP.lib.core.Security.hasPermission(1022) ) {
			this.items.push({
				xtype: 'viewport.menu.vendormenu',
				itemId: 'vendorMenuBtn'
			}, '-');
	    }
		
		// Image Management
		if ( NP.lib.core.Security.hasPermission(2086) && NP.lib.core.Security.hasPermission(2039) && 
				(NP.lib.core.Config.getSetting('pn.main.WebDocumentz') == 1 || NP.lib.core.Config.getSetting('pn.main.WebDocumentz') == 2) ) {
			this.items.push({
				xtype: 'viewport.menu.imagemenu',
				itemId: 'imageMenuBtn'
			}, '-');
	    }
		
		// Budgets
		if ( NP.lib.core.Security.hasPermission(1036) ) {
			this.items.push({
				xtype: 'viewport.menu.budgetmenu',
				itemId: 'budgetMenuBtn'
			}, '-');
	    }
		
		// Reports
		if ( NP.lib.core.Security.hasPermission(1070) ) {
			this.items.push({
				xtype: 'viewport.menu.reportmenu',
				itemId: 'reportMenuBtn'
			}, '-');
	    }
		
		// Administration
		if ( NP.lib.core.Security.hasPermission(3) ) {
			this.items.push({
				xtype: 'viewport.menu.adminmenu',
				itemId: 'adminMenuBtn'
			});
	    }

		this.items.push('->');
		// Favorites
		this.items.push({
			xtype: 'shared.button.favorite',
			itemId: 'addtofavoritesBtn',
			text: NP.Translator.translate('Add to Favorites')
		});

	    this.callParent(arguments);
    }
});