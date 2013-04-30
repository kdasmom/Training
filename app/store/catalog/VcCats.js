/**
 * Store for VcCats. This store uses the VcCat fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to VcCat.
 *
 * @author 
 */
Ext.define('NP.store.catalog.VcCats', {
    extend: 'NP.lib.data.Store',
	
    requires: ['NP.model.catalog.VcCat'],

    service: 'CatalogService',
    action : 'getCategories',

    constructor: function(cfg) {
    	Ext.apply(this, cfg);

    	this.fields = NP.model.catalog.VcCat.getFields();

    	this.callParent(arguments);
    }    
});