/**
 * Created by rnixx on 10/15/13.
 */

Ext.define('NP.view.vendor.VendorSearch', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.vendor.vendorsearch',
    requires: [
        'NP.lib.core.Security',
        'NP.view.shared.button.Search',
        'NP.lib.ui.Grid',
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
        var that = this;
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
                                        name: 'keyword',
                                        fieldLabel: this.searchInputLabel,
                                        margin: '0 5 0 0'
                                    },
                                    {
                                        xtype: 'shared.button.search',
                                        handler: function() {
                                            Ext.bind(that.vendorSearchByKeyword(), that, []);
                                        }
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
                                paging  : true,
                                stateful: true,
                                store: Ext.create('NP.store.vendor.Vendors', {
                                    service           : 'VendorService',
                                    action            : 'findByKeyword',
                                    paging            : true,
                                    extraParams: {
                                        keyword: null,
                                        order       : 'vendor_name',
                                        property_id: NP.Security.getCurrentContext().property_id,
                                        userprofile_id: NP.Security.getUser().get('userprofile_id')
                                    }
                                }),
                                columns: [
                                    {
                                        xtype: 'actioncolumn',
                                        items: [
                                            {
                                                icon: 'resources/images/buttons/new.gif',
                                                tooltip: 'Add to favorite',
                                                width: 10
                                            }
                                        ],
                                        align: 'center'
                                    },
                                    {
                                        xtype: 'actioncolumn',
                                        items: [
                                            {
                                                icon: 'resources/images/buttons/view.gif',
                                                tooltip: 'View',
                                                width: 10
                                            }
                                        ],
                                        align: 'center'
                                    },
                                    {
                                        text: this.venproperdorIdColumnTitle,
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
                                        dataIndex: 'address_line1',
                                        flex: 1,
                                        renderer: function(val, meta, rec) {
                                            console.log('rec: ', rec);
                                            var val = rec.raw.address_line1 +(rec.raw.address_line2 !== '' ? ' ' + rec.raw.address_line2 + ' ' : '') + ', ' + rec.raw.address_city + ', ' + rec.raw.address_state + ' ' + rec.raw.address_zip;
                                            return val;
                                        }
                                    },
                                    {
                                        text: this.vendorStatusColumnTitle,
                                        dataIndex: 'vendor_status',
                                        flex: 1
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        this.callParent(arguments);
    },

    vendorSearchByKeyword: function(keyword) {
        if (!keyword) {
            keyword = this.query('[name="keyword"]')[0].getValue();
        }

        var grid = this.query('customgrid')[0];
        console.log('grid: ', grid);
        grid.getStore().addExtraParams({
            keyword : keyword,
            order       : 'vendor_name',
            property_id: NP.Security.getCurrentContext().property_id,
            userprofile_id: NP.Security.getUser().get('userprofile_id')
        });
        grid.reloadFirstPage();
    }
});