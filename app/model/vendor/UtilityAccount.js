/**
 * @author Baranov A.V.
 * @date 9/26/13
 */

Ext.define('NP.model.vendor.UtilityAccount', {
    extend: 'Ext.data.Model',

    requires: [
        'NP.lib.core.Config',
        'NP.model.vendor.Utility',
        'NP.model.property.Property',
        'NP.model.gl.GlAccount',
        'NP.model.property.Unit'
    ],

    idProperty: 'UtilityAccount_Id',
    fields: [
        { name: 'utilityaccount_id', type: 'int' },
        { name: 'Utility_Id', type: 'int' },
        { name: 'UtilityAccount_Building' },
        { name: 'UtilityAccount_Units', type: 'int' },
        { name: 'UtilityAccount_Bedrooms', type: 'int' },
        { name: 'UtilityAccount_MeterSize' },
        { name: 'UtilityAccount_AccountNumber' },
        { name: 'property_id', type: 'int' },
        { name: 'utilityaccount_active', defaultValue: 1 },
        { name: 'glaccount_id', type: 'int' },
        { name: 'unit_id', type: 'int' }
    ],

    belongsTo: [
        {
            model     : 'NP.model.vendor.Utility',
            name      : 'utility',
            getterName: 'getUtility',
            foreignKey: 'Utility_Id',
            primaryKey: 'Utility_Id',
            reader    : 'jsonflat'
        },{
            model     : 'NP.model.property.Property',
            name      : 'property',
            getterName: 'getProperty',
            foreignKey: 'property_id',
            primaryKey: 'property_id',
            reader    : 'jsonflat'
        },{
            model     : 'NP.model.gl.GlAccount',
            name      : 'gl',
            getterName: 'getGl',
            foreignKey: 'glaccount_id',
            primaryKey: 'glaccount_id',
            reader    : 'jsonflat'
        },{
            model     : 'NP.model.property.Unit',
            name      : 'unit',
            getterName: 'getUnit',
            foreignKey: 'unit_id',
            primaryKey: 'unit_id',
            reader    : 'jsonflat'
        }
    ]
});