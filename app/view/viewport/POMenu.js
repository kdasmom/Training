Ext.define('NP.view.viewport.POMenu', {
    extend: 'Ux.ui.HoverButton',
    alias: 'widget.viewport.pomenu',

    requires: ['NP.core.Config','NP.core.Security'],

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

    	if ( NP.core.Config.getSetting('CP.RECEIVING_ON') == 1 ) {
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
			
			if ( NP.core.Config.getSetting('RECEIPT_postapproval') == 1 ) {
				subSection.menu.items.push({
					text: this.receiptRegisterPendingstText
				});
			}
			
			subSection.menu.items.push({
				text: this.receiptRegisterApprovedText
			});
			
			this.menu.items.push(subSection);
		}
		
		if ( NP.core.Security.hasPermission(1027) ) {
			this.menu.items.push({ text: this.newText });
		}
		
		if ( NP.core.Security.hasPermission(1028) ) {
			this.menu.items.push({ text: this.searchText });
		}
		
		this.callParent(arguments);
    }
});