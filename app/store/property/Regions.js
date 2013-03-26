/**
 * Store for Regions. This store uses the Region model fields.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.property.Regions', {
	extend: 'NP.lib.data.Store',
	
	requires: ['NP.model.property.Region'],

    constructor: function(cfg) {
    	Ext.apply(this, cfg);

    	this.fields = NP.model.property.Region.getFields();

    	this.callParent(arguments);
    }
});