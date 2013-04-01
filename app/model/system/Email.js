/**
 * Model for a Email entity
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.system.Email', {
	extend: 'NP.lib.data.Model',
	
    idProperty: 'email_id',
    fields: [
        { name: 'email_id', type: 'int' },
        { name: 'emailtype_id', type: 'int' },
        { name: 'tablekey_id', type: 'int' },
        { name: 'table_name' },
        { name: 'email_address' }
	]
});
