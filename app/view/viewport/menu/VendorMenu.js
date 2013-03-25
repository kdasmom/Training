/**
 * The Vendor menu
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.menu.VendorMenu', {
    extend: 'NP.lib.ui.HoverButton',
    alias: 'widget.viewport.menu.vendormenu',
    
    requires: ['NP.lib.core.Config','NP.lib.core.Security'],

    vendorText      : 'Vendors',
    newText         : 'New Vendor',
    searchText      : 'Search Vendors',
    connectUsersText: 'VendorConnect Users',

    menu: {},

    initComponent: function() {
        this.text = this.vendorText;
        this.menu.showSeparator = false;
    	this.menu.items = [];

        // New Vendors
	    if ( NP.lib.core.Security.hasPermission(1023) ) {
    		this.menu.items.push({
				text: this.newText
			});
    	}
		
        // Search Vendors
		if ( NP.lib.core.Security.hasPermission(1024) ) {
    		this.menu.items.push({
				text: this.searchText
			});
    	}
    	
        // VendorConnect Users
    	if ( NP.lib.core.Config.getSetting('pn.vendoroptions.vendorportal') == 1 && NP.lib.core.Security.hasPermission(2028 ) ) {
    		this.menu.items.push({
				text: this.connectUsersText
			});
    	}

	    this.callParent(arguments);
    }
});