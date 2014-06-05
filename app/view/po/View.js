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
        'NP.lib.core.Translator',
        'NP.view.po.ViewToolbar',
        'NP.view.shared.invoicepo.ViewWarnings',
        'NP.view.po.ViewHeader',
        'NP.view.shared.CustomFieldContainer',
        'NP.view.shared.invoicepo.ViewLineItems',
        'NP.view.po.ViewShippingBilling',
        'NP.view.shared.invoicepo.ViewNotes',
        'NP.view.shared.invoicepo.ForwardsGrid',
        'NP.view.shared.invoicepo.HistoryLogGrid'
    ],

    layout: {
        type : 'vbox',
        align: 'stretch'
    },

    autoScroll: true,
    defaults  : { cls: 'entityViewPanel', frame: true },

    initComponent: function() {
        var me    = this;

        me.title = NP.Translator.translate('Purchase Order');

        me.tbar = { xtype: 'po.viewtoolbar' };

        me.items = [
            { xtype: 'shared.invoicepo.viewwarnings', type: 'po' },
            { xtype: 'po.viewheader' },
            {
                xtype     : 'shared.customfieldcontainer',
                title     : NP.Translator.translate('Custom Fields'),
                type      : 'po',
                isLineItem: 0,
                fieldCfg  : { comboUi: 'customcombo', fieldCfg: { useSmartStore: true } }
            },
            { xtype: 'shared.invoicepo.viewlineitems', type: 'po' },
            { xtype: 'po.viewshippingbilling', hidden: true },
            { xtype: 'shared.invoicepo.viewnotes', type: 'po' }
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