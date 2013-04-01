/**
 * Model for a Address entity
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.system.Address', {
	extend: 'NP.lib.data.Model',
	
    idProperty: 'address_id',
    fields: [
        { name: 'address_id', type: 'int' },
        { name: 'addresstype_id', type: 'int' },
        { name: 'tablekey_id', type: 'int' },
        { name: 'table_name' },
        { name: 'address_attn' },
        { name: 'address_company' },
        { name: 'address_line1' },
        { name: 'address_line2' },
        { name: 'address_line3' },
        { name: 'address_city' },
        { name: 'address_state' },
        { name: 'address_zip' },
        { name: 'address_zipext' },
        { name: 'address_country' },
        { name: 'address_id_alt' }
	]
});
