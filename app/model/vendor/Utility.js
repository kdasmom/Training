/**
 * @author Baranov A.V.
 * @date 9/24/13
 */

Ext.define('NP.model.vendor.Utility', {
    extend: 'Ext.data.Model',

    requires: [
        'NP.lib.core.Config',
        'NP.model.vendor.UtilityType',
        'NP.model.property.Property',
        'NP.model.vendor.Vendorsite'
    ],

    idProperty: 'Utility_Id',
    fields: [
        { name: 'Utility_Id', type: 'int' },
        { name: 'UtilityType_Id', type: 'int' },
        { name: 'Property_Id', type: 'int' },
        { name: 'Vendorsite_Id', type: 'int' },
        { name: 'periodic_billing_flag', type: 'int' },
        { name: 'period_billing_cycle', type: 'int' }
    ],

    hasOne: [
        {
            model     : 'NP.model.vendor.UtilityType',
            name      : 'utilitytype',
            getterName: 'getUtilityType',
            foreignKey: 'UtilityType_Id',
            primaryKey: 'UtilityType_Id'
        }
    ],

    belongsTo: [
        {
            model     : 'NP.model.property.Property',
            name      : 'property',
            getterName: 'getProperty',
            foreignKey: 'Property_Id',
            primaryKey: 'property_id',
            reader    : 'jsonflat'
        },{
            model     : 'NP.model.vendor.Vendorsite',
            name      : 'vendorsite',
            getterName: 'getVendorsite',
            foreignKey: 'Vendorsite_Id',
            primaryKey: 'vendorsite_id',
            reader    : 'jsonflat'
        }
    ]

});