/**
 * Store for Roles.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.user.Roles', {
    extend: 'NP.lib.data.Store',
    alias : 'store.user.roles',
	
	model: 'NP.model.user.Role'    
});