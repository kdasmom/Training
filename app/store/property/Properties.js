/**
 * Store for Invoices. This store uses the Property model fields.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.property.Properties', {
	extend: 'Ext.data.Store',
	
	requires: ['NP.model.property.Property'],

    constructor: function(cfg) {
    	Ext.apply(this, cfg);

    	this.fields = NP.model.property.Property.getFields();

    	this.callParent(arguments);
    }
});