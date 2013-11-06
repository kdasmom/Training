/**
 * The Vendor menu
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.menu.VendorMenu', {
    extend: 'NP.lib.ui.HoverButton',
    alias: 'widget.viewport.menu.vendormenu',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.lib.core.Translator'
    ],

    menu: {},

    initComponent: function() {
        this.text = NP.Translator.translate('Vendors');
        this.menu.showSeparator = false;
    	this.menu.items = [];

        // New Vendors
	    if ( NP.lib.core.Security.hasPermission(1023) ) {
    		this.menu.items.push({
				text: NP.Translator.translate('New Vendor')
			});
    	}
		
        // Search Vendors
		if ( NP.lib.core.Security.hasPermission(1024) ) {
    		this.menu.items.push({
				text: NP.Translator.translate('Search Vendors')
			});
    	}
    	
        // VendorConnect Users
    	if ( NP.lib.core.Config.getSetting('pn.vendoroptions.vendorportal') == 1 && NP.lib.core.Security.hasPermission(2028 ) ) {
    		this.menu.items.push({
				text: NP.Translator.translate('VendorConnect Users')
			});
    	}

	    this.callParent(arguments);
    }
});