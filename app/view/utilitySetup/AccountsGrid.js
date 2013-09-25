/**
 * @author Baranov A.V.
 * @date 9/25/13
 */


Ext.define('NP.view.utilitySetup.AccountsGrid', {
    extend: 'NP.lib.ui.Grid',
    alias: 'widget.utilitysetup.accountsgrid',

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

        this.store = Ext.create('NP.store.vendor.Vendors', {
            service    : 'VendorService',
            action     : 'findUtilityVendors',
            paging     : true,
            extraParams: {pageSize: 25}
        });

        this.callParent(arguments);
    }
});