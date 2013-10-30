/**
 * @author Baranov A.V.
 * @date 9/24/13
 */

Ext.define('NP.model.vendor.UtilityType', {
    extend: 'Ext.data.Model',

    idProperty: 'UtilityType_Id',
    fields: [
        { name: 'UtilityType_Id', type: 'int' },
        { name: 'UtilityType' },
        { name: 'asp_client_id', type: 'int' },
        { name: 'universal_field_status', type: 'int' }
    ]
});