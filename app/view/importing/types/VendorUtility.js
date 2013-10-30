/**
 * Vendor Utility import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.VendorUtility', {
    extend  : 'NP.view.importing.types.AbstractImportType',
    
    fieldName  : 'file_upload_vendor_utility',

    // For localization
    tabTitle            : 'Vendor Utility',
    entityName          : 'Vendor Utility',
    sectionName         : 'Vendor Setup',
    vendorCodeColText   : 'Vendor Code',
    UtilityTypeColText  : 'Utility Code',
    AccountNumberColText: 'Account Number',
    PropertyIDColText   : 'Property ID',
    UnitIdColText       : 'Unit ID',
    MeterNumberColText  : 'Meter Number',
    GLAccountColText    : 'GL Account',

    getGrid: function() {
        return {
            columns: {
                items: [
                    {
                        text     : this.vendorCodeColText,
                        dataIndex: 'vendor_id_alt'
                    },{
                        text     : this.UtilityTypeColText,
                        dataIndex: 'UtilityType'
                    },{
                        text     : this.AccountNumberColText,
                        dataIndex: 'UtilityAccount_AccountNumber'
                    },{
                        text     : this.PropertyIDColText,
                        dataIndex: 'property_id_alt'
                    },{
                        text     : this.UnitIdColText,
                        dataIndex: 'unit_id_alt'
                    },{
                        text     : this.MeterNumberColText,
                        dataIndex: 'UtilityAccount_MeterSize'
                    },{
                        text     : this.GLAccountColText,
                        dataIndex: 'glaccount_number'
                    }
                ]
            }
        };
    }

});
