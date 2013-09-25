/**
 * @author Baranov A.V.
 * @date 9/26/13
 */


Ext.define('NP.model.utility.UtilityAccount', {
    extend: 'Ext.data.Model',

    requires: ['NP.lib.core.Config'],

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
        { name: 'utilityaccount_active' },
        { name: 'glaccount_id', type: 'int' },
        { name: 'unit_id', type: 'int' }
    ],

    validations: [
        { field: 'UtilityAccount_Building', type: 'length', max: 64 },
        { field: 'UtilityAccount_MeterSize', type: 'length', max: 64 },
        { field: 'UtilityAccount_AccountNumber', type: 'length', max: 64 }
    ]
});