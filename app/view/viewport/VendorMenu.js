Ext.define('NP.view.viewport.VendorMenu', {
    extend: 'Ux.ui.HoverButton',
    alias: 'widget.viewport.vendormenu',
    
    requires: ['NP.core.Config','NP.core.Security'],

    vendorText      : 'Vendors',
    newText         : 'New Vendor',
    searchText      : 'Search Vendors',
    connectUsersText: 'VendorConnect Users',

    menu: {},

    initComponent: function() {
        this.text = this.vendorText;
        this.menu.showSeparator = false;
    	this.menu.items = [];

	    if ( NP.core.Security.hasPermission(1023) ) {
    		this.menu.items.push({
				text: this.newText
			});
    	}
		
		if ( NP.core.Security.hasPermission(1024) ) {
    		this.menu.items.push({
				text: this.searchText
			});
    	}
    	
    	if ( NP.core.Config.getSetting('pn.vendoroptions.vendorportal') == 1 && NP.core.Security.hasPermission(2028 ) ) {
    		this.menu.items.push({
				text: this.connectUsersText
			});
    	}

	    this.callParent(arguments);
    }
});