/**
 * @author Baranov A.V.
 * @date 9/24/13
 */

Ext.define('NP.model.utility.Utility', {
    extend: 'Ext.data.Model',

    requires: [
        'NP.lib.core.Config',
        'NP.model.utility.UtilityType',
        'NP.model.property.Property'
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

    hasMany: [
        {
            model     : 'NP.model.utility.UtilityType',
            name      : 'utilitytype_id',
            foreignKey: 'UtilityType_Id',
            primaryKey: 'UtilityType_Id'
        }
    ],

    belongsTo: [
        {
            model     : 'NP.model.property.Property',
            name      : 'property_id',
            foreignKey: 'Property_Id',
            primaryKey: 'property_id'
        },
        {
            model     : 'NP.model.vendor.Vendorsite',
            name      : 'vendorsite_id',
            foreignKey: 'Vendorsite_Id',
            primaryKey: 'Vendorsite_id'
        }
    ]

});