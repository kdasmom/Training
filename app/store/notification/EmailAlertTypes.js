/**
 * Store for EmailAlertTypes. This store uses the EmailAlertType fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to EmailAlertType.
 *
 * @author 
 */
Ext.define('NP.store.notification.EmailAlertTypes', {
    extend: 'NP.lib.data.Store',
	
    requires: ['NP.model.notification.EmailAlertType'],

    service: 'NotificationService',
    action : 'getAlertTypes',

    constructor: function(cfg) {
    	Ext.apply(this, cfg);

    	this.fields = NP.model.notification.EmailAlertType.getFields();

    	this.callParent(arguments);
    }
});