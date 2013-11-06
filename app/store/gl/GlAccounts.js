/**
 * Store for GlAccounts
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.gl.GlAccounts', {
    extend: 'NP.lib.data.Store',
    alias : 'store.gl.glaccounts',
	
    model: 'NP.model.gl.GlAccount'
});