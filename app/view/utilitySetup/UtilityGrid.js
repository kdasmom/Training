/**
 * Created by rnixx on 9/23/13.
 */
Ext.define('NP.view.utilitySetup.UtilityGrid', {
    extend: 'NP.lib.ui.Grid',
    alias: 'widget.utilitysetup.utilitygrid',

    requires: [
        'NP.lib.core.Config',
        'NP.view.shared.button.New',
        'NP.lib.ui.ComboBox',
        'NP.view.vendor.gridcol.VendorName',
        'NP.view.vendor.gridcol.VendorCode'
    ],

    // For localization
    title                 : 'Utility Register',
    vendorColText         : 'Vendor',
    vendorIdColText       : 'VendorID',
    statusColText         : 'Status',
    addNewVendorButtonText: 'Add New Vendor',

    paging  : true,
    stateful: true,
    stateId : 'utility_grid',

    initComponent: function() {


        this.pagingToolbarButtons = [
            {
                xtype: 'shared.button.new',
                text: this.addNewVendorButtonText
            }
        ];

        // Add the base columns for the grid
        this.columns = {
            defaults: { flex: 1 },
            items   : [
                { xtype: 'vendor.gridcol.vendorname' },
                { xtype: 'vendor.gridcol.vendorcode' },
                {
                    text: this.statusColText,
                    dataIndex: 'vendor_status'
                }
            ]
        };

        this.store = Ext.create('NP.store.vendor.Vendors', {
            service    : 'UtilityService',
            action     : 'getUtilVendors',
            paging     : true
        });

        this.callParent(arguments);
    }
});