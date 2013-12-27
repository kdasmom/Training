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
        'NP.view.shared.SearchByAlphabetButtons',
		'NP.view.vendor.gridcol.ViewVendor',
		'NP.view.vendor.gridcol.AddToFavorite'
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
										xtype: 'customcombo',
										fieldLabel: NP.Translator.translate('Integration Package'),
										name: 'integration_package_name',
										displayField: 'integration_package_name',
										valueField: 'integration_package_id',
										store: Ext.create('NP.store.system.IntegrationPackages', {
											service           : 'ConfigService',
											action            : 'getIntegrationPackages',
											autoLoad          : true,
											extraParams: {
												pageSize: null,
												paymentType_id: null
											}
										}),
										labelWidth: 150,
										queryMode: 'local',
										editable: false,
										typeAhead: false,
										padding: '0 10 0 0',
										selectFirstRecord: true

									},
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
										integration_package_id: null,
                                        property_id: NP.Security.getCurrentContext().property_id,
                                        userprofile_id: NP.Security.getUser().get('userprofile_id')
                                    }
                                }),
                                columns: [
									{
										xtype: 'vendor.gridcol.addtofavorite'
									},
									{
										xtype: 'vendor.gridcol.viewvendor'
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
			if (keyword == '') {
				Ext.Msg.alert('Error', 'Please enter at least one character as a keyword.');
				return;
			}
        }

		var integration_package_id = this.query('[name="integration_package_name"]')[0].getValue();

        var grid = this.query('customgrid')[0];

        grid.getStore().addExtraParams({
            keyword : keyword,
			integration_package_id: integration_package_id,
            property_id: NP.Security.getCurrentContext().property_id,
            userprofile_id: NP.Security.getUser().get('userprofile_id')
        });
        grid.reloadFirstPage();
    }
});