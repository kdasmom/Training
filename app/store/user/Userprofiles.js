/**
 * Store for Userprofiles.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.user.Userprofiles', {
    extend: 'NP.lib.data.Store',
    alias : 'store.user.userprofiles',
	
    model: 'NP.model.user.Userprofile'
});