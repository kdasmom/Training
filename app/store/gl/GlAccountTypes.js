/**
 * Store for GlAccountTypes
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.store.gl.GlAccountTypes', {
    extend: 'NP.lib.data.Store',
    alias : 'store.gl.glaccounttypes',
	
    model: 'NP.model.gl.GlAccountType'
});