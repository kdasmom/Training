/**
 * The Invoice menu
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.menu.InvoiceMenu', {
    extend: 'NP.lib.ui.HoverButton',
    alias: 'widget.viewport.menu.invoicemenu',

    requires: ['NP.lib.core.Config','NP.lib.core.Security'],

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
				// Invoice Register
				{
					itemId: 'invRegisterMenuBtn',
					text: this.registerText,
					menu: {
						showSeparator: false,
						items: [{
							// Open
							itemId: 'openInvRegisterMenuBtn',
							text: this.registerOpenText
						}]
					}
				}
			]
		};

    	var subSection = this.menu.items[0].menu.items;

    	// Overdue
	    if ( NP.lib.core.Config.getSetting('PN.InvoiceOptions.OverDueOn') == 1 ) {
    		subSection.push({
				itemId: 'overdueInvRegisterMenuBtn',
				text: this.registerOverdueText
			});
    	}
    	
    	// Template
    	subSection.push({
			itemId: 'templateInvRegisterMenuBtn',
			text: this.registerTemplateText
		});
    	
    	// On Hold
    	if ( NP.lib.core.Config.getSetting('PN.InvoiceOptions.HoldOn') == 1 ) {
    		subSection.push({
				itemId: 'onholdInvRegisterMenuBtn',
				text: this.registerHoldText
			});
    	}
    	
    	subSection.push(
    	// Pending
    	{
			itemId: 'pendingInvRegisterMenuBtn',
			text: this.registerPendingText
		},
		// Approved
		{
			itemId: 'approvedInvRegisterMenuBtn',
			text: this.registerApprovedText
		},
		// Submitted for Payment
		{
			itemId: 'submittedInvRegisterMenuBtn',
			text: this.registerSubmittedText
		},
		// Transferred to GL
		{
			itemId: 'transferredInvRegisterMenuBtn',
			text: this.registerTransferredText
		},
		// Paid
		{
			itemId: 'paidInvRegisterMenuBtn',
			text: this.registerPaidText
		});
    	
    	// Void
    	if ( NP.lib.core.Config.getSetting('PN.InvoiceOptions.VoidOn') == 1 ) {
    		subSection.push({
				itemId: 'voidInvRegisterMenuBtn',
				text: this.registerVoidText
			});
    	}
    	
    	// Rejected
    	subSection.push({
			itemId: 'rejectedInvRegisterMenuBtn',
			text: this.registerRejectedText
		});
    	
    	// New Invoice
    	if ( NP.lib.core.Security.hasPermission(1032) ) {
    		this.menu.items.push({
				text: this.newText
			});
    	}
    	
    	// Search Invoices
    	if ( NP.lib.core.Security.hasPermission(1033) ) {
    		this.menu.items.push({
				text: this.searchText
			});
    	}

	    this.callParent(arguments);
    }
});