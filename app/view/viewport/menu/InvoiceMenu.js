/**
 * The Invoice menu
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.menu.InvoiceMenu', {
    extend: 'NP.lib.ui.HoverButton',
    alias: 'widget.viewport.menu.invoicemenu',

    requires: [
    	'NP.lib.core.Config',
    	'NP.lib.core.Security',
    	'NP.lib.core.Translator'
    ],

	initComponent: function() {
    	this.text = NP.Translator.translate('Invoices');
		this.menu = {
			showSeparator: false,
			items: [
				// Invoice Register
				{
					itemId: 'invRegisterMenuBtn',
					text: NP.Translator.translate('Invoice Register'),
					menu: {
						showSeparator: false,
						items: [{
							// Open
							itemId: 'openInvRegisterMenuBtn',
							text: NP.Translator.translate('Open')
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
				text: NP.Translator.translate('Overdue')
			});
    	}
    	
    	// Template
    	subSection.push({
			itemId: 'templateInvRegisterMenuBtn',
			text: NP.Translator.translate('Template')
		});
    	
    	// On Hold
    	if ( NP.lib.core.Config.getSetting('PN.InvoiceOptions.HoldOn') == 1 ) {
    		subSection.push({
				itemId: 'onholdInvRegisterMenuBtn',
				text: NP.Translator.translate('On Hold')
			});
    	}
    	
    	subSection.push(
    	// Pending
    	{
			itemId: 'pendingInvRegisterMenuBtn',
			text: NP.Translator.translate('Pending')
		},
		// Approved
		{
			itemId: 'approvedInvRegisterMenuBtn',
			text: NP.Translator.translate('Approved')
		},
		// Submitted for Payment
		{
			itemId: 'submittedInvRegisterMenuBtn',
			text: NP.Translator.translate('Submitted for Payment')
		},
		// Transferred to GL
		{
			itemId: 'transferredInvRegisterMenuBtn',
			text: NP.Translator.translate('Transferred to GL')
		},
		// Paid
		{
			itemId: 'paidInvRegisterMenuBtn',
			text: NP.Translator.translate('Paid')
		});
    	
    	// Void
    	if ( NP.lib.core.Config.getSetting('PN.InvoiceOptions.VoidOn') == 1 ) {
    		subSection.push({
				itemId: 'voidInvRegisterMenuBtn',
				text: NP.Translator.translate('Void')
			});
    	}
    	
    	// Rejected
    	subSection.push({
			itemId: 'rejectedInvRegisterMenuBtn',
			text: NP.Translator.translate('Rejected')
		});
    	
    	// New Invoice
    	if ( NP.lib.core.Security.hasPermission(1032) ) {
    		this.menu.items.push({
				text: NP.Translator.translate('New Invoice')
			});
    	}
    	
    	// Search Invoices
    	if ( NP.lib.core.Security.hasPermission(1033) ) {
    		this.menu.items.push({
				text: NP.Translator.translate('Search Invoices')
			});
    	}

	    this.callParent(arguments);
    }
});