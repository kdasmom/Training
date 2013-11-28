/**
 * Store for Vendors
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.vendor.Vendors', {
    extend: 'NP.lib.data.Store',
    alias : 'store.vendor.vendors',
	
    model: 'NP.model.vendor.Vendor'
});