/**
 * Store for Invoices. This store uses the invoice fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to invoice.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.catalog.Vc', {
    extend: 'NP.lib.data.Store',
	
    requires: ['NP.model.catalog.Vc'],

    constructor: function(cfg) {
    	Ext.apply(this, cfg);

    	this.fields = NP.model.catalog.Vc.getFields();
        this.fields.push(
            { name: 'vc_total_items', type: 'int' },
            { name: 'creator_userprofile_username' },
            { name: 'updater_userprofile_username' }
        );

    	this.callParent(arguments);
    }    
});