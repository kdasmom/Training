Ext.define('NP.view.viewport.InvoiceMenu', {
    extend: 'Ux.ui.HoverButton',
    alias: 'widget.viewport.invoicemenu',

    requires: ['NP.core.Config','NP.core.Security'],

	invoiceText            : 'Invoices',
	registerText           : 'Invoice Register',
	registerOpenText       : 'Open',
	registerOverdueText    : 'Overdue',
	registerTemplateText   : 'Template',
	registerHoldText       : 'On Hold',
	registerPendingText    : 'Pending',
	registerApprovedText   : 'Approved',
	registerSubmittedText  : 'Submitted for Payment',
	registerTransferredText: 'Transferred to GL',
	registerPaidText       : 'Paid',
	registerVoidText       : 'Void',
	registerRejectedText   : 'Rejected',
	newText                : 'New Invoice',
	searchText             : 'Search Invoices',

    initComponent: function() {
    	this.text = this.invoiceText;
		this.menu = {
			showSeparator: false,
			items: [
				{
					itemId: 'invRegisterMenuBtn',
					text: this.registerText,
					menu: {
						showSeparator: false,
						items: [{
							itemId: 'openInvRegisterMenuBtn',
							text: this.registerOpenText
						}]
					}
				}
			]
		};

    	var subSection = this.menu.items[0].menu.items;

	    if ( NP.core.Config.getSetting('PN.InvoiceOptions.OverDueOn') == 1 ) {
    		subSection.push({
				itemId: 'overdueInvRegisterMenuBtn',
				text: this.registerOverdueText
			});
    	}
    	
    	subSection.push({
			itemId: 'templateInvRegisterMenuBtn',
			text: this.registerTemplateText
		});
    	
    	if ( NP.core.Config.getSetting('PN.InvoiceOptions.HoldOn') == 1 ) {
    		subSection.push({
				itemId: 'onholdInvRegisterMenuBtn',
				text: this.registerHoldText
			});
    	}
    	
    	subSection.push({
			itemId: 'pendingInvRegisterMenuBtn',
			text: this.registerPendingText
		},
		{
			itemId: 'approvedInvRegisterMenuBtn',
			text: this.registerApprovedText
		},
		{
			itemId: 'submittedInvRegisterMenuBtn',
			text: this.registerSubmittedText
		},
		{
			itemId: 'transferredInvRegisterMenuBtn',
			text: this.registerTransferredText
		},
		{
			itemId: 'paidInvRegisterMenuBtn',
			text: this.registerPaidText
		});
    	
    	if ( NP.core.Config.getSetting('PN.InvoiceOptions.VoidOn') == 1 ) {
    		subSection.push({
				itemId: 'voidInvRegisterMenuBtn',
				text: this.registerVoidText
			});
    	}
    	
    	subSection.push({
			itemId: 'rejectedInvRegisterMenuBtn',
			text: this.registerRejectedText
		});
    	
    	if ( NP.core.Security.hasPermission(1032) ) {
    		this.menu.items.push({
				text: this.newText
			});
    	}
    	
    	if ( NP.core.Security.hasPermission(1033) ) {
    		this.menu.items.push({
				text: this.searchText
			});
    	}

	    this.callParent(arguments);
    }
});