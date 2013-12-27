/**
 * The Image menu
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.menu.ImageMenu', {
    extend: 'NP.lib.ui.HoverButton',
    alias: 'widget.viewport.menu.imagemenu',
    
    requires: [
    	'NP.lib.core.Config',
    	'NP.lib.core.Security',
    	'NP.lib.core.Translator'
    ],

	initComponent: function() {
    	this.text = NP.Translator.translate('Image Management');
		this.menu = {
			showSeparator: false,
			items: [
				// Images to be Indexed
				{ 
					itemId: 'indexImageMenuBtn',
					text: NP.Translator.translate('Images To Be Indexed') 
	            }
			]
		};

		// Invoice Images
    	if ( NP.lib.core.Security.hasPermission(2081) ) {
			this.menu.items.push({
                itemId: 'invoicesImageMenuBtn',
				text: NP.Translator.translate('Invoice Images')
			});
		}
		
		// Purchase Order Images
		if ( NP.lib.core.Config.getSetting('PN.POOptions.POSwitch') == 1 && NP.lib.core.Security.hasPermission(2087) ) {
			this.menu.items.push({
                itemId: 'purchase-ordersImageMenuBtn',
				text: NP.Translator.translate('Purchase Order Images')
			});
		}
		
		// Search Images
		this.menu.items.push({
            itemId: 'searchImageMenuBtn',
			text: NP.Translator.translate('Search Images')
		});
		
		// Exceptions
		if ( NP.lib.core.Security.hasPermission(6050) ) {
			this.menu.items.push({
                itemId: 'exceptionsImageMenuBtn',
				text: NP.Translator.translate('Exceptions')
			});
		}

	    this.callParent(arguments);
    }
});