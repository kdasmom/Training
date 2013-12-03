/**
 * Created by rnixx on 10/8/13.
 */


Ext.define('NP.model.contact.State', {
    extend: 'Ext.data.Model',

    requires: ['NP.lib.core.Config'],

    idProperty: 'state_id',
    fields: [
        { name: 'state_id', type: 'int' },
        { name: 'state_name' },
        { name: 'state_code' }
    ],

    validations: [
        { field: 'state_name', type: 'length', max: 50 },
        { field: 'state_code', type: 'length', max: 2 }
    ]
});