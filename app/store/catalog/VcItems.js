/**
 * Store for VcItems. This store uses the VcItem fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to VcItem.
 *
 * @author 
 */
Ext.define('NP.store.catalog.VcItems', {
    extend: 'NP.lib.data.Store',
	
    requires: ['NP.model.catalog.VcItem'],

    constructor: function(cfg) {
    	Ext.apply(this, cfg);

    	this.fields = NP.model.catalog.VcItem.getFields();
    	this.fields.push(
    		{ name: 'UNSPSC_Commodity_Commodity', type: 'int' },
			{ name: 'UNSPSC_Commodity_FamilyTitle' },
			{ name: 'UNSPSC_Commodity_CommodityTitle' }
    	);

    	this.callParent(arguments);
    }    
});