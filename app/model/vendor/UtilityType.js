/**
 * @author Baranov A.V.
 * @date 9/24/13
 */

Ext.define('NP.model.utility.UtilityType', {
    extend: 'Ext.data.Model',

    requires: ['NP.lib.core.Config'],

    idProperty: 'UtilityType_Id',
    fields: [
        { name: 'UtilityType_Id', type: 'int' },
        { name: 'UtilityType' },
        { name: 'asp_client_id', type: 'int' },
        { name: 'universal_field_status', type: 'int' }
    ]
});