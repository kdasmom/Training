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
        'NP.view.shared.button.Cancel',
        'NP.lib.ui.ComboBox'
    ],

    // For localization
    title: 'Utility Accounts',
    vendorColText: 'Vendor',
    vendorIdColText: 'VendorID',
    utilityTypeColText: 'Utility',
    accountColText: 'Account',
    meterColText:  'Meter',
    glAccountColText:  'GLAccount',
    propertyColText:  'Property',
    unitColText:  'Unit/Dept',


    paging  : true,
    stateful: true,
    stateId : 'budgetoverage_grid',

    initComponent: function() {

        this.selModel = Ext.create('Ext.selection.CheckboxModel');

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
                text: this.utilityTypeColText,
                dataIndex: 'utilitytype',
                flex: 1
            },
            {
                text: this.accountColText,
                dataIndex: 'utilityaccount_accountnumber',
                flex: 1
            },
            {
                text: this.meterColText,
                dataIndex: 'utilityaccount_metersize',
                flex: 1
            },
            {
                text: this.glAccountColText,
                dataIndex: 'glaccount_name',
                flex: 1
            },
            {
                text: this.propertyColText,
                dataIndex: 'property_name',
                flex: 1
            },
            {
                text: this.unitColText,
                dataIndex: 'unittype_name',
                flex: 1
            },
            {
                xtype: 'actioncolumn',
                items: [
                    {
                        icon: 'resources/images/buttons/delete.gif',
                        tooltip: 'Delete',
                        handler: function(gridView, rowIndex, colIndex) {
                            var grid = gridView.ownerCt;
                            grid.fireEvent('deleterow', grid, grid.getStore().getAt(rowIndex), rowIndex);
                        }
                    }
                ],
                align: 'center'
            }
        ];

//        this.store = Ext.create('NP.store.vendor.Vendors', {
//            service    : 'VendorService',
//            action     : 'findUtilityVendors',
//            paging     : true,
//            extraParams: {pageSize: 25}
//        });

        this.store = [];

        this.callParent(arguments);

        this.addEvents('deleterow');
    }
});