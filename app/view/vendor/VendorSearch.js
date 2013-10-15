/**
 * Created by rnixx on 10/15/13.
 */

Ext.define('NP.view.vendor.VendorSearch', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.vendor.vendorsearch',
    requires: [
        'NP.lib.core.Security',
        'NP.view.vendor.VendorGrid',
        'NP.store.vendor.Vendors',
        'NP.view.shared.button.Search',
        'NP.view.shared.SearchByAlphabetButtons'
    ],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    //  for localization
    titleText: 'Vendor search',
    searchInputLabel: 'Enter keyword',
    vendorIdColumnTitle: 'Vendor Id',
    vendorNameColumnTitle: 'Vendor name',
    vendorAddressColumnTitle: 'Address',
    vendorStatusColumnTitle: 'AddressStatus',
    searchResultsTitle: 'Search results',
    searchBtnText: 'Search',

    /**
     * Init
     */
    initComponent: function(){

        this.title = this.titleText;

        this.items = [
            {
                xtype: 'tabpanel',

                flex: 1,

                defaults :{
                    autoScroll: true,
                    border: false
                },

                items: [
                    {
                        xtype: 'fieldcontainer',
                        layout: 'vbox',
                        title: 'Search form',
                        items:[
                            {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                border: false,
                                padding: '5',
                                margin: '5',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        name: 'searchname',
                                        fieldLabel: this.searchInputLabel,
                                        margin: '0 5 0 0'
                                    },
                                    {
                                        xtype: 'shared.button.search'
                                    }
                                ]
                            },
                            {
                                xtype: 'shared.searchbyalphabetbuttons'
                            },
                            {
                                xtype: 'customgrid',
                                title: this.searchResultsTitle,
                                width: '100%',
                                columns: [
                                    {
                                        text: this.vendorIdColumnTitle,
                                        dataIndex: 'vendor_id',
                                        flex: 1
                                    },
                                    {
                                        text: this.vendorNameColumnTitle,
                                        dataIndex: 'vendor_name',
                                        flex: 1
                                    },
                                    {
                                        text: this.vendorAddressColumnTitle,
                                        dataIndex: 'vendor_address',
                                        flex: 1
                                    },
                                    {
                                        text: this.vendorStatusColumnTitle,
                                        dataIndex: 'vendor_status',
                                        flex: 1
                                    },
                                    {
                                        xtype: 'actioncolumn',
                                        items: [
                                            {
                                                icon: 'resources/images/buttons/new.gif',
                                                tooltip: 'Add to favorite'
                                            },
                                            {
                                                icon: 'resources/images/buttons/view.gif',
                                                tooltip: 'View'
                                            }
                                        ],
                                        align: 'center'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});