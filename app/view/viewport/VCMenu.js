Ext.define('NP.view.viewport.VCMenu', {
    extend: 'Ux.ui.HoverButton',
    alias: 'widget.viewport.vcmenu',

	vcText        : 'Vendor Catalog',
	listingsText  : 'Vendor Catalog Listings',
	openOrdersText: 'Open Orders',
	favoritesText : 'Favorite Items',

    initComponent: function() {
    	this.text = this.vcText,
		this.menu = {
			showSeparator: false,
			items: [
				{ text: this.listingsText },
				{ text: this.openOrdersText },
				{ text: this.favoritesText }
			]
		};

		this.callParent(arguments);
	}
});