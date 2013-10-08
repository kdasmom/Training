/**
 * Created by rnixx on 10/8/13.
 */


Ext.define('NP.store.system.TaxPayorTypes', {
    extend: 'NP.lib.data.Store',

    fields: [
        { name: 'lookupcode_id', type: 'int'},
        { name: 'lookupcode_code' }
    ],

    service: 'ConfigService',
    action: 'getLookupCodes',
    extraParams: {
        lookupcode_type: 'taxpayortype'
    }
});