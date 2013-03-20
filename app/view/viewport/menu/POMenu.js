Ext.define('NP.view.viewport.menu.POMenu', {
    extend: 'NP.lib.ui.HoverButton',
    alias: 'widget.viewport.menu.pomenu',

    requires: ['NP.lib.core.Config','NP.lib.core.Security'],

	poText                      : 'Purchase Orders',
	registerText                : 'PO Register',
	registerOpenText            : 'Open',
	registerTemplateText        : 'Template',
	registerPendingText         : 'Pending',
	registerApprovedText        : 'Approved',
	registerInvoicedText        : 'Invoiced',
	registerRejectedText        : 'Rejected',
	registerCancelledText       : 'Cancelled',
	receiptRegisterText         : 'Receipt Register',
	receiptRegisterOpenText     : 'Open',
	receiptRegisterRejectedText : 'Rejected',
	receiptRegisterPendingText  : 'Pending Approval',
	receiptRegisterPendingstText: 'Pending Post Approval',
	receiptRegisterApprovedText : 'Approved',
	newText                     : 'New PO',
	searchText                  : 'Search POs',

    initComponent: function() {
    	this.text = this.poText;
		this.menu = {
			showSeparator: false,
			items: [
				{
					text: this.registerText,
					menu: {
						showSeparator: false,
						items: [
							{ text: this.registerOpenText },
							{ text: this.registerTemplateText },
							{ text: this.registerPendingText },
							{ text: this.registerApprovedText },
							{ text: this.registerInvoicedText },
							{ text: this.registerRejectedText },
							{ text: this.registerCancelledText }
						]
					}
				}
			]
		};

    	if ( NP.lib.core.Config.getSetting('CP.RECEIVING_ON') == 1 ) {
			var subSection = { 
				text: this.receiptRegisterText,
				menu: {
					showSeparator: false,
					items: [
						{ text: this.receiptRegisterOpenText },
						{ text: this.receiptRegisterRejectedText },
						{ text: this.receiptRegisterPendingText }
					]
				}
			};
			
			if ( NP.lib.core.Config.getSetting('RECEIPT_postapproval') == 1 ) {
				subSection.menu.items.push({
					text: this.receiptRegisterPendingstText
				});
			}
			
			subSection.menu.items.push({
				text: this.receiptRegisterApprovedText
			});
			
			this.menu.items.push(subSection);
		}
		
		if ( NP.lib.core.Security.hasPermission(1027) ) {
			this.menu.items.push({ text: this.newText });
		}
		
		if ( NP.lib.core.Security.hasPermission(1028) ) {
			this.menu.items.push({ text: this.searchText });
		}
		
		this.callParent(arguments);
    }
});