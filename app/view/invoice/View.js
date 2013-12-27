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
        'NP.view.shared.CustomFieldContainer',
        'NP.view.shared.invoicepo.ViewLineItems',
        'NP.view.invoice.ViewNotes',
        'NP.view.invoice.ViewReclass',
        'NP.view.invoice.ViewPayments',
        'NP.view.shared.invoicepo.ForwardsGrid',
        'NP.view.shared.invoicepo.HistoryLogGrid'
    ],

    layout: {
        type : 'vbox',
        align: 'stretch'
    },

    autoScroll: true,
    defaults  : { cls: 'invoiceViewPanel', frame: true },

    // For localization
    title: 'Invoice',

    initComponent: function() {
        var me    = this;

        me.tbar = { xtype: 'invoice.viewtoolbar' };

        me.items = [
            { xtype: 'shared.invoicepo.viewwarnings', type: 'invoice' },
            { xtype: 'invoice.viewheader' },
            { xtype: 'shared.customfieldcontainer', title: 'Custom Fields', type: 'invoice', isLineItem: 0 },
            { xtype: 'shared.invoicepo.viewlineitems', type: 'invoice' },
            { xtype: 'invoice.viewnotes' }
        ];

        if (NP.Security.hasPermission(2094) || NP.Security.hasPermission(6093)) {
            me.items.push({ xtype: 'invoice.viewreclass', hidden: true });
        }

        me.items.push(
            { xtype: 'shared.invoicepo.historyloggrid', type: 'invoice', maxHeight: 200 },
            { xtype: 'invoice.viewpayments', hidden: true, maxHeight: 200 },
            { xtype: 'shared.invoicepo.forwardsgrid', title: 'Invoice Forwards', type: 'invoice', maxHeight: 200 }
        );

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