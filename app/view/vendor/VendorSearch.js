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
    vendorStatusColumnTitle: 'Vendor Status',
    searchResultsTitle: 'Search results',
    searchBtnText: 'Search',

    /**
     * Init
     */
    initComponent: function(){
        var that = this;
        var property_id = NP.Security.getCurrentContext().property_id;

        this.title = this.titleText;
        this.tbar = [];

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
                                xtype: 'shared.searchbyalphabetbuttons',
                                onButton: function(button) {
                                    Ext.bind(that.vendorSearchByKeyword(button.text), that, []);
                                }

                            },
                            {
                                xtype: 'customgrid',
                                title: this.searchResultsTitle,
                                width: '100%',
                                paging: true,
                                store: Ext.create('NP.store.vendor.Vendors', {
                                    service           : 'VendorService',
                                    action            : 'findByKeyword',
                                    paging: true,
                                    extraParams: {
                                        keyword: null,
                                        property_id: NP.Security.getCurrentContext().property_id,
                                        userprofile_id: NP.Security.getUser().get('userprofile_id')
                                    }
                                }),
                                columns: [
                                    {
                                        xtype: 'actioncolumn',
                                        renderer: function(val, meta, rec) {
                                            this.items[0].disable();
                                            if (rec.raw.vendorfavorite_id !== null && rec.raw.property_id == property_id) {
                                                this.items[0].icon = 'resources/images/buttons/delete.gif';
                                                this.items[0].tooltip = 'Remove from favorite';
                                                this.items[0].enable();
                                            } else {
                                                if (!rec.raw.vendorfavorite_id) {
                                                    this.items[0].icon = 'resources/images/buttons/new.gif';
                                                    this.items[0].tooltip = 'Add to favorite';
                                                    this.items[0].enable();
                                                } else {
                                                    this.items[0].icon = '';
                                                }
                                            }
                                        },
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex);
                                            var vendorsite_id = rec.get('vendorsite_id');
                                            var op = !rec.raw['vendorfavorite_id'] ? 'add' : 'remove';
                                            NP.lib.core.Net.remoteCall({
                                                        requests: {
                                                            service: 'VendorService',
                                                            action : 'updateFavorite',
                                                            vendorsite_id    : vendorsite_id,
                                                            property_id: NP.Security.getCurrentContext().property_id,
                                                            op: op,
                                                            success: function(result, deferred) {
                                                                var page = grid.getStore().currentPage;
                                                                grid.getStore().reload();
                                                            }
                                                        }
                                                    });
                                        },
                                        align: 'center'
                                    },
                                    {
                                        xtype: 'actioncolumn',
                                        items: [
                                            {
                                                icon: 'resources/images/buttons/view.gif',
                                                tooltip: 'View',
                                                width: 10,
                                                handler: function(gridView, rowIndex, colIndex) {
                                                    var grid = gridView.ownerCt;
                                                    grid.fireEvent('viewvendor', grid, grid.getStore().getAt(rowIndex), rowIndex);
                                                }
                                            }
                                        ],
                                        align: 'center'
                                    },
                                    {
                                        text: this.vendorIdColumnTitle,
                                        dataIndex: 'vendorsite_id_alt',
                                        flex: 1,
                                        renderer: function(val, meta, rec) {
                                            return rec.raw.vendorsite_id_alt;
                                        }
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
        this.query('customgrid')[0].addEvents('viewvendor');
    },

    vendorSearchByKeyword: function(keyword) {
        if (!keyword) {
            keyword = this.query('[name="keyword"]')[0].getValue();
        }

        var grid = this.query('customgrid')[0];

        grid.getStore().addExtraParams({
            keyword : keyword,
            property_id: NP.Security.getCurrentContext().property_id,
            userprofile_id: NP.Security.getUser().get('userprofile_id')
        });
        grid.reloadFirstPage();
    }
});