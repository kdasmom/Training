Ext.define('NP.view.viewport.ImageMenu', {
    extend: 'Ux.ui.HoverButton',
    alias: 'widget.viewport.imagemenu',
    
    requires: ['NP.core.Config','NP.core.Security'],

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
				{ text: this.indexedText }
			]
		};

    	if ( NP.core.Security.hasPermission(2081) ) {
			this.menu.items.push({
				text: this.invoiceText
			});
		}
		
		if ( NP.core.Config.getSetting('PN.POOptions.POSwitch') == 1 && NP.core.Security.hasPermission(2087) ) {
			this.menu.items.push({
				text: this.pOText
			});
		}
		
		this.menu.items.push({
			text: this.searchText
		});
		
		if ( NP.core.Security.hasPermission(6050) ) {
			this.menu.items.push({
				text: this.exceptionsText
			});
		}

	    this.callParent(arguments);
    }
});