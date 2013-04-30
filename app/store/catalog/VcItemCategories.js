/**
 * Store for Item Categories
 *
 * @author 
 */
Ext.define('NP.store.catalog.VcItemCategories', {
    extend: 'NP.lib.data.Store',
	
    service    : 'CatalogService',
    action     : 'getItemCategories',
    extraParams: { vc_id: null },

    fields: [
    	{ name: 'category_id' },
        { name: 'category_name' }
    ]
});