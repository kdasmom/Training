/**
 * Created by rnixx on 10/8/13.
 */


Ext.define('NP.model.vendor.VendorType', {
    extend: 'Ext.data.Model',

    requires: ['NP.lib.core.Config'],

    idProperty: 'vendortype_id',
    fields: [
        { name: 'vendortype_id', type: 'int' },
        { name: 'vendortype_name' },
        { name: 'vendortype_code' },
        { name: 'integration_package_id', type: 'int' },
        { name: 'universal_field_status', type: 'int' }
    ],

    validations: [
        { field: 'vendortype_name', type: 'length', max: 240 },
        { field: 'vendortype_code', type: 'length', max: 30 }
    ]
});