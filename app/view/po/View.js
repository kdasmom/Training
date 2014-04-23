/**
 * The main form component for the PO view page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.View', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.po.view',
    
    requires: [
        'NP.lib.core.Security',
        'NP.view.po.ViewToolbar',
        'NP.view.shared.invoicepo.ViewWarnings',
        'NP.view.po.ViewHeader',
        'NP.view.shared.CustomFieldContainer',
        'NP.view.shared.invoicepo.ViewLineItems',
        //'NP.view.invoice.ViewNotes',
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
    title: 'Purchase Order',

    initComponent: function() {
        var me    = this;

        me.tbar = { xtype: 'po.viewtoolbar' };

        me.items = [
            { xtype: 'shared.invoicepo.viewwarnings', type: 'po' },
            { xtype: 'po.viewheader' },
            { xtype: 'shared.customfieldcontainer', title: 'Custom Fields', type: 'po', isLineItem: 0 },
            { xtype: 'shared.invoicepo.viewlineitems', type: 'po' }/*,
            { xtype: 'invoice.viewnotes' }*/
        ];

        me.items.push(
            { xtype: 'shared.invoicepo.historyloggrid', type: 'po', maxHeight: 200 },
            { xtype: 'shared.invoicepo.forwardsgrid', title: 'PO Forwards', type: 'po', maxHeight: 200 }
        );

        me.callParent(arguments);
    },

    getEntityRecord: function() {
        var me = this,
            po = me.getModel('po.Purchaseorder');

        return po;
    }
});