/**
 * Model for a Phone entity
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.system.Phone', {
	extend: 'NP.lib.data.Model',
	
    idProperty: 'phone_id',
    fields: [
        { name: 'phone_id', type: 'int' },
        { name: 'phonetype_id', type: 'int' },
        { name: 'tablekey_id', type: 'int' },
        { name: 'table_name' },
        { name: 'phone_number' },
        { name: 'phone_ext' },
        { name: 'phone_countrycode' }
	]
});
