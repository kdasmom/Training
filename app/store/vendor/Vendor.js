/**
 * Store for Vendors. This store uses the Vendor fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to Vendor.
 *
 * @author 
 */
Ext.define('NP.store.vendor.Vendor', {
    extend: 'NP.lib.data.Store',
	
    requires: ['NP.model.vendor.Vendor'],

    constructor: function(cfg) {
    	Ext.apply(this, cfg);

    	this.fields = NP.model.vendor.Vendor.getFields();

    	this.callParent(arguments);
    }    
});