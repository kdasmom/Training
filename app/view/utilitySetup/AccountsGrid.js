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
    stateId : 'accounts_grid',

    initComponent: function() {

        this.selModel = Ext.create('Ext.selection.CheckboxModel');

        // Add the base columns for the grid
        this.columns = [
            {
                text: this.vendorColText,
                dataIndex: 'vendor_name',
                flex: 1,
                renderer: function(val, meta, rec) {
                    val = rec.raw.vendor_name;

                    return val;
                }
            },
            {
                text: this.vendorIdColText,
                dataIndex: 'vendor_id',
                flex: 1,
                renderer: function(val, meta, rec) {
                    val = rec.raw.vendor_id;

                    return val;
                }
            },
            {
                text: this.utilityTypeColText,
                dataIndex: 'utilitytype',
                flex: 1,
                renderer: function(val, meta, rec) {
                    val = rec.raw.utilitytype;

                    return val;
                }
            },
            {
                text: this.accountColText,
                dataIndex: 'UtilityAccount_AccountNumber',
                flex: 1
            },
            {
                text: this.meterColText,
                dataIndex: 'UtilityAccount_MeterSize',
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
                flex: 1,
                renderer: function(val, meta, rec) {
                    val = rec.raw.property_name;

                    return val;
                }
            },
            {
                text: this.unitColText,
                dataIndex: 'unit_number',
                flex: 1,
                renderer: function(val, meta, rec) {
                    val = rec.raw.unit_number;

                    return val;
                }
            }
        ];
        this.store = [];

        this.callParent(arguments);

        this.addEvents('deleterow');
    }
});