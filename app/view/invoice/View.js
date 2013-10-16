/**
 * The main form component for the Invoice view page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.View', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.invoice.view',
    
    requires: [
    	'NP.lib.core.Security',
    	'NP.view.invoice.ViewToolbar',
        'NP.view.shared.invoicepo.ViewWarnings',
    	'NP.view.invoice.ViewHeader',
    	'NP.view.invoice.ViewCustomFields',
    	'NP.view.invoice.ViewLineItems',
    	'NP.view.invoice.ViewNotes',
    	'NP.view.invoice.ViewReclass',
    	'NP.view.invoice.ViewPayments',
    	'NP.view.shared.invoicepo.ForwardsGrid',
        'NP.view.shared.invoicepo.HistoryLogGrid'
    ],

    layout: 'fit',

    // For localization
    title: 'Invoice',

    initComponent: function() {
    	var me           = this,
    		centerRegion = {
				region    : 'center',
				xtype     : 'panel',
				border    : false,
				autoScroll: true,
				defaults  : { cls: 'invoiceViewPanel', frame: true },
				items     : [
                    { xtype: 'shared.invoicepo.viewwarnings', type: 'invoice' },
		    		{ xtype: 'invoice.viewheader' },
		    		{ xtype: 'invoice.viewcustomfields' },
                    { xtype: 'invoice.viewlineitems', type: 'invoice' },
		    		{ xtype: 'invoice.viewnotes' }
		    	]
			};

    	me.tbar = { xtype: 'invoice.viewtoolbar' };

        me.items = [];

		if (NP.Security.hasPermission(2094) || NP.Security.hasPermission(6093)) {
			centerRegion.items.push({ xtype: 'invoice.viewreclass', hidden: true });
		}

		centerRegion.items.push(
            { xtype: 'shared.invoicepo.historyloggrid', type: 'invoice', maxHeight: 400 },
    		{ xtype: 'invoice.viewpayments', hidden: true, maxHeight: 400 },
		    { xtype: 'shared.invoicepo.forwardsgrid', title: 'Invoice Forwards', type: 'invoice', maxHeight: 400 }
		);

		me.items.push(centerRegion);

    	me.callParent(arguments);
    },

    getInvoiceRecord: function() {
        var me      = this,
        	invoice = me.getModel('invoice.Invoice');

        return invoice;
    },

    isInvoiceModifiable: function() {
        var me      = this,
            invoice = me.getInvoiceRecord();

        if (NP.Security.hasPermission(6076)) {
            return true;
        }

        if (NP.Security.hasPermission(6077) 
                && NP.Security.getUser().get('userprofile_id') == invoice.get('userprofile_id')) {
            return true;
        }

        return false;
    },
    
    isInvoiceLineEditable: function() {
        var me      = this,
            status  = me.getInvoiceRecord().get('invoice_status');

        if (
            (status == 'open' && (NP.Security.hasPermission(1032) || NP.Security.hasPermission(6076) || NP.Security.hasPermission(6077)))
            || (status == 'saved' && NP.Security.hasPermission(1068) && me.isInvoiceModifiable())
            || (status == 'paid' && NP.Security.hasPermission(2094))
        ) {
            return true;
        }

        return false;
    }
});