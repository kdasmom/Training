/**
 * This is main view for "Image Management" section.
 * 
 * @author Oleg Sososrev
 */
Ext.define('NP.view.image.Main', {
    extend: 'Ext.panel.Panel',
    alias:  'widget.image.main',

    title :  'Image Management',
    layout: 'fit',
    border: false,

    requires: [
        'NP.view.image.grid.Index',
        'NP.view.image.grid.Invoices',
        'NP.view.image.grid.PurchaseOrders',
        'NP.view.image.grid.Exceptions',
        'NP.view.image.grid.DeletedImages',

        'NP.view.shared.button.Camera',
        'NP.view.shared.button.Delete',
        'NP.view.image.button.npiss',
        'NP.view.image.button.nsiss',
        'NP.view.shared.button.Search',
        'NP.view.shared.button.Report'
    ],

    locale: {
        tabIndex:           'Images to be Indexed',
        tabInvoices:        'Invoices',
        tabPurchaseOrders:  'POs',
        tabExceptions:      'Exceptions',
        tabDeletedImages:   'Deleted Images',

        buttonUpload: 'Upload',
        buttonNPISS:  'NexusPayables Invoice Separator Sheet',
        buttonNSISS:  'Nexus Services Invoice Separator Sheet',

        buttonIndex:             'Index Selected',
        buttonDelete:            'Delete Selected',
        buttonConvert:           'Convert Selected',
        buttonRevert:            'Revert Selected',
        buttonDeletePermanently: 'Permanently Delete Selected',

        buttonReport: 'Report',
        buttonSearch: 'Search Images'
    },

    initComponent: function() {
        this.items = [
            {
                xtype: 'tabpanel',
                items: [
                    this.tabIndex(),
                    this.tabInvoices(),
                    this.tabPurchaseOrders(),
                    this.tabExceptions(),
                    this.tabDeletedImages()
                ]
            }
        ];

        this.tbar = {
            enableOverflow: true,
            items         : [
                {xtype: 'shared.button.camera', itemId: 'buttonUpload', text: this.locale.buttonUpload},
                {xtype: 'image.button.npiss', itemId: 'buttonNPISS',  text: this.locale.buttonNPISS},
                {xtype: 'image.button.nsiss', itemId: 'buttonNSISS',  text: this.locale.buttonNSISS},

                {xtype: 'shared.button.search', itemId: 'buttonSearch', text: this.locale.buttonSearch},

                {xtype: 'tbspacer', flex: 1},
                {xtype: 'shared.contextpicker', itemId: 'componentContextPicker'}
            ]
        };
        
        this.callParent(arguments);
    },

    /**
     * Prepare grid for "Images to be Indexed" tab.
     * 
     * @return tab items.
     */
    tabIndex: function() {
        var tab = {
            itemId: 'images-index',

            xtype: 'image.grid.Index',
            title: this.locale.tabIndex,
            pagingToolbarButtons: [
                {xtype: 'button', itemId: 'buttonIndex',  text: this.locale.buttonIndex},
                {xtype: 'shared.button.delete', itemId: 'buttonDelete', text: this.locale.buttonDelete}
            ]
        };
        return tab;
    },

    /**
     * Prepare grid for "Invoices" tab.
     * 
     * @return tab items.
     */
    tabInvoices: function() {
        var tab = {
            itemId: 'images-invoices',

            xtype: 'image.grid.Invoices',
            title: this.locale.tabInvoices,
            pagingToolbarButtons: [
                {xtype: 'button', itemId: 'buttonConvert', text: this.locale.buttonConvert},
                {xtype: 'button', itemId: 'buttonRevert',  text: this.locale.buttonRevert},
                {xtype: 'shared.button.delete', itemId: 'buttonDelete',  text: this.locale.buttonDelete},
                {xtype:'tbseparator'},
                {xtype: 'shared.button.report', itemId: 'buttonReport', text: this.locale.buttonReport}
            ]
        };
        return tab;
    },

    /**
     * Prepare grid for "Purchase Orders" tab.
     * 
     * @return tab items.
     */
    tabPurchaseOrders: function() {
        var tab = {
            itemId: 'images-purchase-orders',

            xtype: 'image.grid.PurchaseOrders',
            title: this.locale.tabPurchaseOrders,
            pagingToolbarButtons: [
                {xtype: 'button', itemId: 'buttonRevert',  text: this.locale.buttonRevert},
                {xtype: 'shared.button.delete', itemId: 'buttonDelete',  text: this.locale.buttonDelete},
                {xtype:'tbseparator'},
                {xtype: 'shared.button.report', itemId: 'buttonReport', text: this.locale.buttonReport}
            ]
        };
        return tab;
    },

    /**
     * Prepare grid for "Exceptions" tab.
     * 
     * @return tab items.
     */
    tabExceptions: function() {
        var tab = {
            itemId: 'images-exceptions',

            xtype: 'image.grid.Exceptions',
            title: this.locale.tabExceptions,
            pagingToolbarButtons: [
                {xtype: 'button', itemId: 'buttonIndex',  text: this.locale.buttonIndex},
                {xtype: 'shared.button.delete', itemId: 'buttonDelete', text: this.locale.buttonDelete},
                {xtype:'tbseparator'},
                {xtype: 'shared.button.report', itemId: 'buttonReport', text: this.locale.buttonReport}
            ]
        };
        return tab;
    },

    /**
     * Prepare grid for "Deleted Images" tab.
     * 
     * @return tab items.
     */
    tabDeletedImages: function() {
        var tab = {
            itemId: 'images-deleted',

            xtype: 'image.grid.DeletedImages',
            title: this.locale.tabDeletedImages,
            pagingToolbarButtons: [
                {xtype: 'button', itemId: 'buttonRevert', text: this.locale.buttonRevert},
                {xtype: 'shared.button.delete', itemId: 'buttonDeletePermanently', text: this.locale.buttonDeletePermanently}
            ]
        };
        return tab;
    }
});