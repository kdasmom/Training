/**
 * Store for Warnings (for POs and invoices).
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.shared.Warnings', {
    extend: 'NP.lib.data.Store',
	alias : 'store.shared.warnings',
	
	model: 'NP.model.shared.Warning'
});