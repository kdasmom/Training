/**
 * @author Baranov A.V.
 * @date 9/24/13
 */

Ext.define('NP.model.vendor.Utility', {
    extend: 'Ext.data.Model',

    requires: [
        'NP.lib.core.Config'
    ],

    idProperty: 'Utility_Id',
    fields: [
        { name: 'Utility_Id', type: 'int' },
        { name: 'UtilityType_Id', type: 'int' },
        { name: 'Property_Id', type: 'int' },
        { name: 'Vendorsite_Id', type: 'int' },
        { name: 'periodic_billing_flag', type: 'int' },
        { name: 'period_billing_cycle', type: 'int' }
    ]
});