Ext.define('NP.view.images.Search', {
    extend: 'Ext.panel.Panel',
    alias:  'widget.images.search',

    title:  'Search Images',
    autoscroll: true,

    requires: [
        'NP.view.shared.ContextPickerMulti',
        'NP.view.images.grid.Search',

        'NP.view.shared.button.Return',
        'NP.view.shared.button.Search',
        'NP.view.shared.button.Cd',
        'NP.view.shared.button.Go'
    ],

    locale: {
        buttonGo: 'Go',
        buttonSearch: 'Search',
        buttonCDIndex: 'CD Index',
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

        var storeSearchType = Ext.create('NP.lib.data.Store', {
            data: [
                {'image-criteria-index': 1, 'image-criteria': 'Image Name'},
                {'image-criteria-index': 2, 'image-criteria': 'Scan Date'},
                {'image-criteria-index': 3, 'image-criteria': 'Vendor'}
            ],
            fields: ['image-criteria', 'image-criteria-index']
        });

        this.items = [
            {
                xtype: 'panel',
                bodyPadding: 10,

                items: [
                    {
                        xtype: 'text',
                        padding: '0 0 10 0',
                        text: 'Use the following form to search for Images:'
                    },
                    {
                        itemId: 'field-image-doctype',

                        xtype: 'customcombo',
                        fieldLabel: 'Image Type:',

                        valueField:   'image_doctype_id',
                        displayField: 'image_doctype_name',

                        store: storeImageDoctypes,
                        value: 1
                    },
                    {
                        itemId: 'field-image-searchtype',

                        xtype: 'customcombo',
                        fieldLabel: 'Search By:',

                        displayField: 'image-criteria',
                        valueField:   'image-criteria-index',

                        store: storeSearchType,
                        value: 1,

                        listeners: {
                            select: this.onSearchCriteriaChange
                        }
                    },
                    {
                        itemId: 'field-image-name',

                        xtype: 'textfield',
                        fieldLabel: 'Image Name:'
                    },
                    {
                        itemId: 'field-scan-date',

                        xtype: 'datefield',
                        fieldLabel: 'Scan Date:'
                    },
                    {
                        itemId: 'field-vendor',

                        xtype: 'textfield',
                        fieldLabel: 'Vendor:'
                    },
                    {
                        xtype: 'shared.button.go',
                        itemId: 'buttonSearchProcessAction'
                    },
                    {
                        xtype: 'shared.contextpickermulti',
                        fieldLabel: 'Property:'
                    }
                ]
            },
            {
                xtype: 'images.grid.Search',

                itemId: 'grid-search-results',
                title: 'Search Results'
            }
        ];

        this.tbar = [
            {xtype: 'shared.button.return', itemId: 'buttonReturn', text: this.locale.buttonReturn},
            {xtype: 'tbspacer', width: 20},
            {xtype: 'shared.button.search', itemId: 'buttonSearchProcess', text: this.locale.buttonSearch},
            {xtype: 'shared.button.cd', itemId: 'buttonSearchCDIndex', text: this.locale.buttonCDIndex}
        ];
        this.callParent(arguments);

        this.onSearchCriteriaChange();
    },

    /**
     * Show appropriate fields when search document type is changed.
     * 
     * @param combo Document type combo box.
     * @param records Combobox data.
     */
    onSearchCriteriaChange: function(combo, records) {
        var visibility = {
            'Image Name': {
                'field-image-name': true,
                'field-scan-date' : false,
                'field-vendor'    : false
            },
            'Scan Date': {
                'field-image-name': false,
                'field-scan-date' : true,
                'field-vendor'    : false
            },
            'Vendor': {
                'field-image-name': false,
                'field-scan-date' : false,
                'field-vendor'    : true
            }
        };

        if (combo && records) {
            var title = records[0]['data'][combo['displayField']];
        } else {
            title = 'Image Name';
        }

        for (var key in visibility[title]) {
            var field = Ext.ComponentQuery.query('[itemId~="' + key + '"]')[0];
            visibility[title][key] ? field.show() : field.hide();
        }
    }
});