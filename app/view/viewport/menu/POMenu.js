/**
 * The Purchase Orders menu
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.menu.POMenu', {
    extend: 'NP.lib.ui.HoverButton',
    alias: 'widget.viewport.menu.pomenu',

    requires: [
    	'NP.lib.core.Config',
    	'NP.lib.core.Security',
    	'NP.lib.core.Translator'
    ],

    initComponent: function() {
    	this.text = NP.Translator.translate('Purchase Orders');
		this.menu = {
			showSeparator: false,
			items: [
				// PO Register
				{
					itemId: 'poRegisterMenuBtn',
					text: NP.Translator.translate('PO Register'),
					menu: {
						showSeparator: false,
						items: [
							// Open
							{ itemId: 'openPoRegisterMenuBtn', text: NP.Translator.translate('Open') },
							// Template
							{ itemId: 'templatePoRegisterMenuBtn', text: NP.Translator.translate('Template') },
							// Pending
							{ itemId: 'pendingPoRegisterMenuBtn', text: NP.Translator.translate('Pending') },
							// Approved
							{ itemId: 'approvedPoRegisterMenuBtn', text: NP.Translator.translate('Approved') },
							// Invoiced
							{ itemId: 'invoicedPoRegisterMenuBtn', text: NP.Translator.translate('Invoiced') },
							// Rejected
							{ itemId: 'rejectedPoRegisterMenuBtn', text: NP.Translator.translate('Rejected') },
							// Cancelled
							{ itemId: 'cancelledPoRegisterMenuBtn', text: NP.Translator.translate('Cancelled') }
						]
					}
				}
			]
		};

    	if ( NP.lib.core.Config.getSetting('CP.RECEIVING_ON') == 1 ) {
			var subSection = {
				// Receipt Register
				text: NP.Translator.translate('Receipt Register'),
				menu: {
					showSeparator: false,
					items: [
						// Open
						{ text: NP.Translator.translate('Open') },
						// Rejected
						{ text: NP.Translator.translate('Rejected') },
						// Pending Approval
						{ text: NP.Translator.translate('Pending Approval') }
					]
				}
			};
			
			// Pending Post Approval
			if ( NP.lib.core.Config.getSetting('RECEIPT_postapproval') == 1 ) {
				subSection.menu.items.push({
					text: NP.Translator.translate('Pending Post Approval')
				});
			}
			
			// Approved
			subSection.menu.items.push({
				text: NP.Translator.translate('Approved')
			});
			
			this.menu.items.push(subSection);
		}
		
		// New PO
		if ( NP.lib.core.Security.hasPermission(1027) ) {
			this.menu.items.push({ text: NP.Translator.translate('New PO') });
		}
		
		// Search POs
		if ( NP.lib.core.Security.hasPermission(1028) ) {
			this.menu.items.push({ text: NP.Translator.translate('Search POs') });
		}
		
		this.callParent(arguments);
    }
});