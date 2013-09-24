/**
 * Created by rnixx on 9/23/13.
 */
Ext.define('NP.view.utilitySetup.VendorsGrid', {
    extend: 'NP.lib.ui.Grid',
    alias: 'widget.utilitysetup.vendorsgrid',

    requires: [
        'NP.lib.core.Config',
        'NP.view.shared.button.New',
        'NP.lib.ui.ComboBox'
    ],

    // For localization
    title: 'Utility Register',
    vendorColText: 'Vendor',
    vendorIdColText: 'VendorID',
    statusColText: 'Status',
    addNewVendorButtonText: 'Add New Vendor',

    paging  : true,
    stateful: true,
    stateId : 'budgetoverage_grid',

    initComponent: function() {


        this.pagingToolbarButtons = [
            {
                xtype: 'shared.button.new',
                text: this.addNewVendorButtonText
            }
        ];

        // Add the base columns for the grid
        this.columns = [
            {
                text: this.vendorColText,
                dataIndex: 'vendor_name',
                flex: 1
            },
            {
                text: this.vendorIdColText,
                dataIndex: 'vendor_id',
                flex: 1
            },
            {
                text: this.statusColText,
                dataIndex: 'vendor_status',
                flex: 1
            }
        ];

        this.store = Ext.create('NP.store.utility.Utilities', {
            service    : 'UtilityService',
            action     : 'findVendors',
            paging     : true,
            extraParams: {pageSize: 25}
        });

        this.callParent(arguments);
    }
});