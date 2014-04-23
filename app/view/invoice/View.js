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
    defaults  : { cls: 'entityViewPanel', frame: true },

    // For localization
    title: 'Invoice',

    initComponent: function() {
        var me    = this;

        me.tbar = { xtype: 'invoice.viewtoolbar' };

        me.items = [
            { xtype: 'shared.invoicepo.viewwarnings', type: 'invoice' },
            { xtype: 'invoice.viewheader' },
            {
                xtype     : 'shared.customfieldcontainer',
                title     : 'Custom Fields',
                type      : 'invoice',
                isLineItem: 0,
                fieldCfg  : { comboUi: 'customcombo', fieldCfg: { useSmartStore: true } }
            },
            { xtype: 'shared.invoicepo.viewlineitems', type: 'invoice' },
            { xtype: 'invoice.viewnotes', type: 'invoice' }
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

    getEntityRecord: function() {
        var me      = this,
            invoice = me.getModel('invoice.Invoice');

        return invoice;
    }


    /*code Review*/
});