/**
 * Store for a hierarchical role list.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.user.RoleTree', {
    extend: 'NP.lib.data.Store',
	
	fields: [
        { name: 'role_id', type: 'int' },
        { name: 'role_name' },
        { name: 'level', type: 'int' },
        { name: 'indent_text' }
    ]    
});