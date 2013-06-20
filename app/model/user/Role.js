/**
 * Model for a Role entity
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.user.Role', {
	extend: 'Ext.data.Model',
	
    idProperty: 'role_id',
    fields: [
        { name: 'role_id', type: 'int' },
        { name: 'role_name' },
        { name: 'is_admin_role', type: 'int' }
	]
});
