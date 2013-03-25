/**
 * The Vendor Catalog menu
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.menu.VCMenu', {
    extend: 'NP.lib.ui.HoverButton',
    alias: 'widget.viewport.menu.vcmenu',

	vcText        : 'Vendor Catalog',
	listingsText  : 'Vendor Catalog Listings',
	openOrdersText: 'Open Orders',
	favoritesText : 'Favorite Items',

    initComponent: function() {
    	this.text = this.vcText,
		this.menu = {
			showSeparator: false,
			items: [
				// Vendor Catalog Listings
				{ text: this.listingsText },
				// Open Orders
				{ text: this.openOrdersText },
				// Favorite Items
				{ text: this.favoritesText }
			]
		};

		this.callParent(arguments);
	}
});