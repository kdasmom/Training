/**
 * Store for Delegations. This store uses the Delegation model fields.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.user.Delegations', {
	extend: 'NP.lib.data.Store',
    alias : 'store.user.delegations',
	
	model: 'NP.model.user.Delegation'
});