Ext.define('NP.view.images.SearchCDIndex', {
    extend: 'Ext.panel.Panel',
    alias:  'widget.images.searchcdindex',

    title:  'Document Search',
    autoscroll: true,

    requires: [
        'NP.view.images.grid.SearchCDIndex',

        'NP.view.shared.button.Return',
        'NP.view.shared.button.Search',
        'NP.view.shared.button.Print',
        'NP.view.shared.button.Go'
    ],

    locale: {
        buttonPrint: 'Print',
        buttonSearch: 'Search',
        buttonReturn: 'Return to Image Management'
    },

    initComponent: function() {
        var tablerefs = [];
        if (NP.lib.core.Config.getSetting('pn.main.WebDocumentz') == 1 || NP.lib.core.Config.getSetting('pn.main.WebDocumentz') == 2) {
            if (NP.lib.core.Security.hasPermission(2081)) {
                tablerefs.push(1);
            }
        }
        if (NP.lib.core.Config.getSetting('pn.main.WebDocumentz') == 2) {
            if (NP.lib.core.Security.hasPermission(2087)) {
                tablerefs.push(3);
            }
            if (NP.lib.core.Security.hasPermission(2088)) {
                tablerefs.push(4);
            }
            if (NP.lib.core.Security.hasPermission(2089)) {
                tablerefs.push(2);
            }
        }
        
        var storeImageDoctypes = Ext.create('NP.store.images.ImageDocTypes', {
            service    : 'ImageService',
            action     : 'getImageDoctypes',
            extraParams: {
                'tablerefs': tablerefs.join(',')
            }
        });
        storeImageDoctypes.load();

        var storeProperties = Ext.create('NP.store.property.Properties', {
            service    : 'ImageService',
            action     : 'getPropertyList',
            extraParams: {
                userprofile_id: NP.Security.getUser().get('userprofile_id'),
                delegation_to_userprofile_id: NP.Security.getUser().get('delegation_to_userprofile_id')
            }
        });
        storeProperties.load();

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
                        itemId: 'field-image-doctype',

                        xtype: 'customcombo',
                        fieldLabel: 'Image Type:',

                        valueField:   'image_doctype_id',
                        displayField: 'image_doctype_name',

                        store: storeImageDoctypes,
                        value: 1,

                        listeners: {
                            select: this.onDocumentTypeChange
                        }
                    },
                    {
                        itemId: 'field-image-properties',

                        xtype: 'customcombo',
                        fieldLabel: 'Property:',

                        addBlankRecord: true,

                        valueField:   'property_id',
                        displayField: 'property_name',

                        store: storeProperties
                    },
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
                        itemId: 'field-refnumber',

                        xtype: 'textfield',
                        fieldLabel: 'Reference:'
                    },
                    {
                        xtype: 'shared.button.go',
                        itemId: 'buttonSearchCDIndexProcessAction'
                    }
                ]
            },
            {
                xtype: 'images.grid.SearchCDIndex',

                itemId: 'grid-search-cdindex-results',
                title: 'Search Results'
            }
        ];

        this.tbar = [
            {xtype: 'shared.button.return', itemId: 'buttonReturn', text: this.locale.buttonReturn},
            {xtype: 'tbspacer', width: 20},
            {xtype: 'shared.button.search', itemId: 'buttonSearchCDIndexProcess', text: this.locale.buttonSearch},
            {xtype: 'shared.button.print', itemId: 'buttonSearchCDIndexPrint', text: this.locale.buttonPrint, hidden: true}
        ];

        this.callParent(arguments);
    },

    /**
     * Show appropriate fields when search document type is changed.
     * 
     * @param combo Document type combo box.
     * @param records Combobox data.
     */
    onDocumentTypeChange: function(combo, records) {
        if (combo && records) {
            var value = records[0]['data'][combo['valueField']];
            var title = records[0]['data'][combo['displayField']];
        }

        var showPropertyAndReference = 
            title.toLowerCase() == 'invoice' ||
            title.toLowerCase() == 'purchase order' ||
            title.toLowerCase() == 'vendor estimate' || 
            value == ''
        ;

        if (showPropertyAndReference) {
            Ext.ComponentQuery.query('[itemId~="field-refnumber"]')[0].show();
            Ext.ComponentQuery.query('[itemId~="field-image-properties"]')[0].show();
        } else {
            Ext.ComponentQuery.query('[itemId~="field-refnumber"]')[0].hide();
            Ext.ComponentQuery.query('[itemId~="field-image-properties"]')[0].hide();
        }
    }
});