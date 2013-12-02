/**
 * The Vendor Catalog menu
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.menu.VCMenu', {
    extend: 'NP.lib.ui.HoverButton',
    alias: 'widget.viewport.menu.vcmenu',

    requires: ['NP.lib.core.Translator'],

	initComponent: function() {
    	this.text = NP.Translator.translate('Vendor Catalog');
		this.menu = {
			showSeparator: false,
			items: [
				// Vendor Catalog Listings
				{
					text: NP.Translator.translate('Vendor Catalog Listings'),
					itemId: 'vendorCatalogListing'
				},
				// Open Orders
				{
					text: NP.Translator.translate('Open Orders'),
					itemId: 'vcOrders'
				},
				// Favorite Items
				{ text: NP.Translator.translate('Favorite Items') }
			]
		};

		this.callParent(arguments);
	}
});