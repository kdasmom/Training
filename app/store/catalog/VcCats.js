/**
 * Store for VcCats
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.catalog.VcCats', {
    extend: 'NP.lib.data.Store',
    alias : 'store.catalog.vccats',
	
    model: 'NP.model.catalog.VcCat',

    service: 'CatalogService',
    action : 'getCategories'
});