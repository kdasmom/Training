Ext.define('NP.view.images.Search', {
    extend: 'Ext.form.Panel',
    alias:  'widget.images.search',

    title:  'Search Images',

    uids: {
        buttonReturn: 'buttonReturn'
    },
    locale: {
        buttonReturn: 'Return to Image Management'
    },

    initComponent: function() {
        this.bodyPadding = 10;

        this.items = [
            {
                id: 'field-image-type',
                xtype: 'combobox',
                fieldLabel: 'Image Type:',

                displayField: 'image-type',
                valueField:   'image-type-index',

                store: Ext.create('Ext.data.Store', {
                    data: [
                        {'image-type-index': 0, 'image-type': 'Invoice'},
                        {'image-type-index': 1, 'image-type': 'Purchase Order'}
                    ],
                    fields: ['image-type', 'image-type-index']
                }),

                value: 0
            },
            {
                id: 'field-image-criteria',
                xtype: 'combobox',
                fieldLabel: 'Search By:',

                displayField: 'image-criteria',
                valueField:   'image-criteria-index',

                store: Ext.create('Ext.data.Store', {
                    data: [
                        {'image-criteria-index': 0, 'image-criteria': 'Image Name'},
                        {'image-criteria-index': 1, 'image-criteria': 'Scan Date'},
                        {'image-criteria-index': 2, 'image-criteria': 'Vendor'}
                    ],
                    fields: ['image-criteria', 'image-criteria-index']
                }),

                value: 0,

                listeners: {
                    select: this.onSearchCriteriaChange
                }
            },
            {
                id: 'field-image-name',
                xtype: 'textfield',
                fieldLabel: 'Image Name:'
            },
            {
                id: 'field-scan-date',
                xtype: 'datefield',
                fieldLabel: 'Scan Date:'
            },
            {
                id: 'field-vendor',
                xtype: 'textfield',
                fieldLabel: 'Vendor:'
            },
            {
                id: 'field-property',
                xtype: 'radiogroup',
                fieldLabel: 'Property',

                columns: 4,
                vertical: true,

                items: [
                    {
                        name: 1,
                        boxLabel: 'Current Property',
                        inputValue: 1,
                        checked: true,
                        width: 150
                    },
                    {
                        name: 2,
                        boxLabel: 'Multiple Properties',
                        inputValue: 2,
                        width: 150
                    },
                    {
                        name: 3,
                        boxLabel: 'Region',
                        inputValue: 3,
                        width: 150
                    },
                    {
                        name: 4,
                        boxLabel: 'All Properties',
                        inputValue: 4,
                        width: 150
                    }
                ]
            }
        ];
        this.buttons = [{text: 'Search'}];

        this.tbar = [
            {xtype: 'button', itemId: this.uids.buttonReturn,  text: this.locale.buttonReturn},
        ];
        this.callParent(arguments);

        this.onSearchCriteriaChange();
    },

    onSearchCriteriaChange: function(combo, records) {
        var visibility = {
            'Image Name': {
                'field-image-name': true,
                'field-scan-date': false,
                'field-vendor': false
            },
            'Scan Date': {
                'field-image-name': false,
                'field-scan-date': true,
                'field-vendor': false
            },
            'Vendor': {
                'field-image-name': false,
                'field-scan-date': false,
                'field-vendor': true
            }
        };

        if (combo && records) {
            var title = records[0]['data'][combo['displayField']];
        } else {
            title = 'Image Name';
        }

        for (var key in visibility[title]) {
            var field = Ext.ComponentQuery.query('[id~="' + key + '"]')[0];
            visibility[title][key] ? field.show() : field.hide();
        }

    }
});