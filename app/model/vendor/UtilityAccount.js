/**
 * @author Baranov A.V.
 * @date 9/26/13
 */

Ext.define('NP.model.vendor.UtilityAccount', {
    extend: 'Ext.data.Model',

    requires: [
        'NP.lib.core.Config'
    ],

    idProperty: 'UtilityAccount_Id',
    fields: [
        { name: 'UtilityAccount_Id', type: 'int' },
        { name: 'Utility_Id', type: 'int' },
        { name: 'UtilityAccount_Building' },
        { name: 'UtilityAccount_Units', type: 'int' },
        { name: 'UtilityAccount_Bedrooms', type: 'int' },
        { name: 'UtilityAccount_MeterSize' },
        { name: 'UtilityAccount_AccountNumber' },
        { name: 'property_id', type: 'int' },
        { name: 'utilityaccount_active', defaultValue: 1 },
        { name: 'glaccount_id', type: 'int' },
        { name: 'unit_id', type: 'int' },

        // These fields are not columns in the database
        { name: 'Vendorsite_Id', type: 'int' },

        { name: 'UtilityType_Id', type: 'int' },
        { name: 'UtilityType' },

        { name: 'property_id_alt' },
        { name: 'property_name' },

        { name: 'glaccount_number' },
        { name: 'glaccount_name' },

        { name: 'unit_id_alt' },
        { name: 'unit_number' },
        
        {
            name   : 'display_name',
            convert: function(v, rec) {
                return NP.model.vendor.UtilityAccount.formatName(rec);
            }
        }
    ],

    statics: {
        formatName: function(rec) {
            var utilityaccount_id = rec.get('UtilityAccount_Id');

            if (!utilityaccount_id) {
                utilityaccount_id = rec.get('utilityaccount_id');
                if (!utilityaccount_id) {
                    return '';
                }
            }

            var val         = rec.get('UtilityAccount_AccountNumber') + ' (' + rec.get('UtilityType') + ')',
                meterNumber = rec.get('UtilityAccount_MeterSize');

            if (meterNumber != '' && meterNumber !== null) {
                val += ' - ' + meterNumber;
            }

            return val;
        }
    }
});