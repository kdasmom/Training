/**
 * Store for Purchaseorders.
 *
 * @author 
 */
Ext.define('NP.store.po.Purchaseorders', {
    extend: 'NP.lib.data.Store',
    alias : 'store.po.purchaseorders',
	
	model: 'NP.model.po.Purchaseorder'
});