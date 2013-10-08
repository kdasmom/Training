/**
 * The Image menu
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.menu.ImageMenu', {
    extend: 'NP.lib.ui.HoverButton',
    alias: 'widget.viewport.menu.imagemenu',
    
    requires: ['NP.lib.core.Config','NP.lib.core.Security'],

	imgText       : 'Image Management',
	indexedText   : 'Images To Be Indexed',
	invoiceText   : 'Invoice Images',
	pOText        : 'Purchase Order Images',
	searchText    : 'Search Images',
	exceptionsText: 'Exceptions',

    initComponent: function() {
    	this.text = this.imgText;
		this.menu = {
			showSeparator: false,
			items: [
				// Images to be Indexed
				{ 
                                     itemId: 'indexedImageMenuBtn',
                                     text: this.indexedText 
                                 }
			]
		};

		// Invoice Images
    	if ( NP.lib.core.Security.hasPermission(2081) ) {
			this.menu.items.push({
                                itemId: 'invoicesImageMenuBtn',
				text: this.invoiceText
			});
		}
		
		// Purchase Order Images
		if ( NP.lib.core.Config.getSetting('PN.POOptions.POSwitch') == 1 && NP.lib.core.Security.hasPermission(2087) ) {
			this.menu.items.push({
                                itemId: 'posImageMenuBtn',
				text: this.pOText
			});
		}
		
		// Search Images
		this.menu.items.push({
                        itemId: 'searchImageMenuBtn',
			text: this.searchText
		});
		
		// Exceptions
		if ( NP.lib.core.Security.hasPermission(6050) ) {
			this.menu.items.push({
                                itemId: 'exceptionsImageMenuBtn',
				text: this.exceptionsText
			});
		}

	    this.callParent(arguments);
    }
});