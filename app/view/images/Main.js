/**
 * This is main view for "Image Management" section.
 * 
 * @author Oleg Sososrev
 */
Ext.define('NP.view.images.Main', {
    extend: 'Ext.panel.Panel',
    alias:  'widget.images.main',

    title:  'Image Management',
    layout: 'fit',

    requires: [
        'NP.view.images.grid.Index',
        'NP.view.images.grid.Invoices',
        'NP.view.images.grid.PurchaseOrders',
        'NP.view.images.grid.Exceptions',
        'NP.view.images.grid.DeletedImages',

        'NP.view.shared.button.Camera',
        'NP.view.shared.button.Delete',
        'NP.view.images.button.npiss',
        'NP.view.images.button.nsiss',
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
                listeners: {
                    'tabchange': this.onTabChanged.bind(this)
                },
                items: [
                    this.tabIndex(),
                    this.tabInvoices(),
                    this.tabPurchaseOrders(),
                    this.tabExceptions(),
                    this.tabDeletedImages()
                ]
            }
        ];

        this.tbar = Ext.create('Ext.toolbar.Toolbar', {
            enableOverflow: true
        });
        this.tbar.add(this.topbarIndex());
        
        this.callParent(arguments);
    },

    /**
     * When tab and target grid are changed, toolbar buttons also should be adjusted: should
     * provide correct functionality.
     * 
     * @this [NP.view.images.Main] this class
     * 
     * @param tabPanel current tab panel.
     * @param newCard opened tab.
     * @param oldCard closed tab.
     */
    onTabChanged: function (tabPanel, newCard, oldCard) {
        var section = 
            newCard.getItemId().replace('images-', '').toLowerCase()
        ;
        switch (section) {
            case 'index':
                section = 'Index';
                break;
            case 'invoices':
                section = 'Invoices';
                break;
            case 'purchase-orders':
                section = 'PurchaseOrders';
                break;
            case 'exceptions':
                section = 'Exceptions';
                break;
            case 'deleted':
                section = 'DeletedImages';
                break;
        }

        var toolbar = 
            Ext.ComponentQuery.query('[xtype="images.main"]')[0].getDockedItems()[1]
        ;
        var buttons = this['topbar' + section]();

        toolbar.removeAll();
        toolbar.add(buttons);
    },

    /**
     * Prepare grid for "Images to be Indexed" tab.
     * 
     * @return tab items.
     */
    tabIndex: function() {
        var tab = {
            itemId: 'images-index',

            xtype: 'images.grid.Index',
            title: this.locale.tabIndex
        };
        return tab;
    },

    /**
     * Prepare top toolbar button list for "Images to be Indexed" tab.
     * 
     * @return Array of buttons for this tab.
     */
    topbarIndex: function() {
        var tbar = [
            {xtype: 'button', itemId: 'buttonIndex',  text: this.locale.buttonIndex},
            {xtype: 'shared.button.delete', itemId: 'buttonDelete', text: this.locale.buttonDelete},

            {xtype: 'tbspacer', width: 20},

            {xtype: 'shared.button.camera', itemId: 'buttonUpload', text: this.locale.buttonUpload},
            {xtype: 'images.button.npiss', itemId: 'buttonNPISS',  text: this.locale.buttonNPISS},
            {xtype: 'images.button.nsiss', itemId: 'buttonNSISS',  text: this.locale.buttonNSISS},

            {xtype: 'tbspacer', width: 20},

            {xtype: 'shared.button.search', itemId: 'buttonSearch', text: this.locale.buttonSearch}
        ]

        this.buttonsCommon(tbar);
        return tbar;
    },

    /**
     * Prepare grid for "Invoices" tab.
     * 
     * @return tab items.
     */
    tabInvoices: function() {
        var tab = {
            itemId: 'images-invoices',

            xtype: 'images.grid.Invoices',
            title: this.locale.tabInvoices
        };
        return tab;
    },

    /**
     * Prepare top toolbar button list for "Invoices" tab.
     * 
     * @return Array of buttons for this tab.
     */
    topbarInvoices: function() {
        var tbar = [
            {xtype: 'button', itemId: 'buttonConvert', text: this.locale.buttonConvert},
            {xtype: 'button', itemId: 'buttonRevert',  text: this.locale.buttonRevert},
            {xtype: 'shared.button.delete', itemId: 'buttonDelete',  text: this.locale.buttonDelete},

            {xtype: 'tbspacer', width: 20},

            {xtype: 'shared.button.report', itemId: 'buttonReport', text: this.locale.buttonReport},
            {xtype: 'shared.button.search', itemId: 'buttonSearch', text: this.locale.buttonSearch}
        ];

        this.buttonsCommon(tbar);
        return tbar;
    },

    /**
     * Prepare grid for "Purchase Orders" tab.
     * 
     * @return tab items.
     */
    tabPurchaseOrders: function() {
        var tab = {
            itemId: 'images-purchase-orders',

            xtype: 'images.grid.PurchaseOrders',
            title: this.locale.tabPurchaseOrders
        };
        return tab;
    },

    /**
     * Prepare top toolbar button list for "Purchase Orders" tab.
     * 
     * @return Array of buttons for this tab.
     */
    topbarPurchaseOrders: function() {
        var tbar = [
            {xtype: 'button', itemId: 'buttonRevert',  text: this.locale.buttonRevert},
            {xtype: 'shared.button.delete', itemId: 'buttonDelete',  text: this.locale.buttonDelete},

            {xtype: 'tbspacer', width: 20},

            {xtype: 'shared.button.report', itemId: 'buttonReport', text: this.locale.buttonReport},
            {xtype: 'shared.button.search', itemId: 'buttonSearch', text: this.locale.buttonSearch}
        ];

        this.buttonsCommon(tbar);
        return tbar;
    },

    /**
     * Prepare grid for "Exceptions" tab.
     * 
     * @return tab items.
     */
    tabExceptions: function() {
        var tab = {
            itemId: 'images-exceptions',

            xtype: 'images.grid.Exceptions',
            title: this.locale.tabExceptions
        };
        return tab;
    },

    /**
     * Prepare top toolbar button list for "Exceptions" tab.
     * 
     * @return Array of buttons for this tab.
     */
    topbarExceptions: function() {
        var tbar = [
            {xtype: 'button', itemId: 'buttonIndex',  text: this.locale.buttonIndex},
            {xtype: 'shared.button.delete', itemId: 'buttonDelete', text: this.locale.buttonDelete},

            {xtype: 'tbspacer', width: 20},

            {xtype: 'shared.button.report', itemId: 'buttonReport', text: this.locale.buttonReport},
            {xtype: 'shared.button.search', itemId: 'buttonSearch', text: this.locale.buttonSearch}
        ];

        this.buttonsCommon(tbar);
        return tbar;
    },

    /**
     * Prepare grid for "Deleted Images" tab.
     * 
     * @return tab items.
     */
    tabDeletedImages: function() {
        var tab = {
            itemId: 'images-deleted',

            xtype: 'images.grid.DeletedImages',
            title: this.locale.tabDeletedImages
        };
        return tab;
    },

    /**
     * Prepare top toolbar button list for "Deleted Images" tab.
     * 
     * @return Array of buttons for this tab.
     */
    topbarDeletedImages: function() {
        var tbar = [
            {xtype: 'button', itemId: 'buttonRevert', text: this.locale.buttonRevert},
            {xtype: 'shared.button.delete', itemId: 'buttonDeletePermanently', text: this.locale.buttonDeletePermanently},

            {xtype: 'tbspacer', width: 20},

            {xtype: 'shared.button.search', itemId: 'buttonSearchDeleted', text: this.locale.buttonSearch}
        ];

        this.buttonsCommon(tbar);
        return tbar;
    },

    /**
     * Buttons which should be presented at the each tab.
     * 
     * @param toolbar List of buttons where common buttons should be added.
     */
    buttonsCommon: function(toolbar) {
        toolbar.push(
            {xtype: 'tbspacer', flex: 1},
            {xtype: 'shared.contextpicker', itemId: 'componentContextPicker'}
        );
    }
});