Ext.define('NP.view.images.SearchDeleted', {
    extend: 'Ext.panel.Panel',
    alias:  'widget.images.searchdeleted',

    title:  'Deleted Images Search',
    autoscroll: true,

    requires: [
        'NP.view.images.grid.SearchDeleted',

        'NP.view.shared.button.Return',
        'NP.view.shared.button.Search',
    ],

    locale: {
        buttonSearch: 'Search',
        buttonReturn: 'Return to Image Management'
    },

    initComponent: function() {
        var storeVendors = Ext.create('NP.store.vendor.Vendors', {
            service    : 'ImageService',
            action     : 'getVendorList'
        });
        storeVendors.load();

        this.items = [
            {
                xtype: 'panel',
                bodyPadding: 10,
                layout: 'form',

                items: [
                    {
                        itemId: 'field-image-vendors',

                        xtype: 'customcombo',
                        fieldLabel: 'Vendor:',

                        addBlankRecord: true,

                        valueField:   'vendor_id',
                        displayField: 'vendor_name',

                        store: storeVendors
                    },
                    {
                        itemId: 'field-invoice-number',

                        xtype: 'textfield',
                        fieldLabel: 'Invoice Number:'
                    },
                    {
                        itemId: 'field-deleted-by',

                        xtype: 'textfield',
                        fieldLabel: 'Deleted By:'
                    }
                ]
            },
            {
                xtype: 'images.grid.SearchDeleted',

                itemId: 'grid-search-deleted-results',
                title: 'Search Results'
            }
        ];

        this.tbar = [
            {xtype: 'shared.button.return', itemId: 'buttonReturn', text: this.locale.buttonReturn},
            {xtype: 'tbspacer', width: 20},
            {xtype: 'shared.button.search', itemId: 'buttonSearchDeletedProcess', text: this.locale.buttonSearch},
        ];

        this.callParent(arguments);
    }
});