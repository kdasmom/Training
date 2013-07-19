/**
 * Store for a hierarchical module list.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.security.ModuleTree', {
    extend: 'NP.lib.data.Store',
	
	fields: [
        { name: 'module_id', type: 'int' },
        { name: 'module_name' },
        { name: 'level', type: 'int' },
        { name: 'indent_text' }
    ]    
});