Ext.define('NP.view.viewport.TopMenu', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.viewport.topmenu',

    requires: [
    	'NP.core.Security'
    	,'NP.view.viewport.VCMenu'
    	,'NP.view.viewport.POMenu'
    	,'NP.view.viewport.InvoiceMenu'
    	,'NP.view.viewport.VendorMenu'
    	,'NP.view.viewport.ImageMenu'
    	,'NP.view.viewport.BudgetMenu'
    	,'NP.view.viewport.ReportMenu'
    	,'NP.view.viewport.AdminMenu'
    ],

    dock: 'top',

    itemId: 'viewportTopMenu',

    initComponent: function() {
    	var section, subSection;

    	this.items = [];

	    // Vendor Catalog
	    if ( NP.core.Config.getSetting('VC_isOn') == 1 && NP.core.Security.hasPermission(6067) ) {
			this.items.push({
				xtype: 'viewport.vcmenu',
				itemId: 'vcMenuBtn'
			});
	    }
	    
	    // Purchase Orders
		if ( NP.core.Config.getSetting('PN.POOptions.POSwitch') == 1 && NP.core.Security.hasPermission(1026) ) {
			this.items.push({
				xtype: 'viewport.pomenu'
			});
		}
	    
	    // Invoice
	    if ( NP.core.Security.hasPermission(1031) ) {
	    	this.items.push({
				xtype: 'viewport.invoicemenu',
				itemId: 'invMenuBtn'
			});
		}
		
		// Vendors
		if ( NP.core.Security.hasPermission(1022) ) {
			this.items.push({
				xtype: 'viewport.vendormenu',
				itemId: 'vendorMenuBtn'
			});
	    }
		
		// Image Management
		if ( NP.core.Security.hasPermission(2086) && NP.core.Security.hasPermission(2039) && 
				(NP.core.Config.getSetting('pn.main.WebDocumentz') == 1 || NP.core.Config.getSetting('pn.main.WebDocumentz') == 2) ) {
			this.items.push({
				xtype: 'viewport.imagemenu',
				itemId: 'imageMenuBtn'
			});
	    }
		
		// Budgets
		if ( NP.core.Security.hasPermission(1036) ) {
			this.items.push({
				xtype: 'viewport.budgetmenu',
				itemId: 'budgetMenuBtn'
			});
	    }
		
		// Reports
		if ( NP.core.Security.hasPermission(1070) ) {
			this.items.push({
				xtype: 'viewport.reportmenu',
				itemId: 'reportMenuBtn'
			});
	    }
		
		// Administration
		if ( NP.core.Security.hasPermission(3) ) {
			this.items.push({
				xtype: 'viewport.adminmenu',
				itemId: 'adminMenuBtn'
			});
	    }

	    this.callParent(arguments);
    }
});