Ext.define('NP.view.image.SearchCDIndex', {
    extend: 'Ext.panel.Panel',
    alias:  'widget.image.searchcdindex',

    title:  'Document Search',
    autoscroll: true,

    requires: [
        'NP.view.image.grid.SearchCDIndex',
        'NP.view.shared.VendorAutoComplete',
        'NP.lib.core.Translator',
        'NP.view.shared.button.Reset',
        'NP.view.shared.button.Search',
        'NP.view.shared.button.Print'
    ],

    locale: {
        buttonPrint: 'Print',
        buttonSearch: 'Search',
        buttonReturn: 'Return to Image Management'
    },

    layout: {
        type : 'vbox',
        align: 'stretch'
    },

    initComponent: function() {
        var tablerefs  = [],
            labelWidth = 75;

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
        
        this.tbar = [
            {xtype: 'shared.button.reset', itemId: 'buttonReturn', text: this.locale.buttonReturn},
            {xtype: 'shared.button.print', itemId: 'buttonSearchCDIndexPrint', text: this.locale.buttonPrint, hidden: true}
        ];

        var storeImageDoctypes = Ext.create('NP.store.image.ImageDocTypes', {
            service    : 'ImageService',
            action     : 'getImageDoctypes',
            extraParams: {
                'tablerefs': tablerefs.join(',')
            }
        });
        storeImageDoctypes.load();

        var storeProperties = Ext.create('NP.store.property.Properties', {
            service    : 'UserService',
            action     : 'getUserProperties',
            autoLoad   : false,
            extraParams: {
                userprofile_id             : NP.Security.getUser().get('userprofile_id'),
                delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id')
            }
        });
        //storeProperties.load();

        var storeVendors = Ext.create('NP.store.vendor.Vendors', {
            service    : 'VendorService',
            action     : 'findByStatus',
            paging     : true,
            extraParams: {
                status: 'active,inactive',
                order : 'vendor_name'
            }
        });
        //storeVendors.load();

        this.items = [
            {
                xtype      : 'panel',
                border     : false,
                bodyPadding: 8,
                layout     : 'form',
                defaults   : { labelWidth: labelWidth },
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
                        fieldLabel: 'Property',

                        loadStoreOnFirstQuery: true,
                        emptyText: NP.Translator.translate('All Properties...'),

                        valueField:   'property_id',
                        displayField: 'property_name',

                        store: storeProperties
                    },
                    {
                        itemId: 'field-image-vendors',

                        xtype     : 'shared.vendorautocomplete',
                        fieldLabel: 'Vendor',
                        store     : storeVendors,
                        emptyText : NP.Translator.translate('All Vendors...'),
                        allowBlank: true
                    },
                    {
                        itemId: 'field-refnumber',

                        xtype: 'textfield',
                        fieldLabel: 'Reference'
                    },
                    {
                        xtype : 'shared.button.search',
                        itemId: 'buttonSearchCDIndexProcessAction',
                        margin: '2 0 0 ' + (labelWidth + 5)
                    }
                ]
            },
            {
                xtype : 'image.grid.searchcdindex',

                itemId: 'grid-search-cdindex-results',
                title : 'Search Results',
                flex  : 1
            }
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