/**
 * Store for EmailAlertTypes
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.notification.EmailAlertTypes', {
    extend: 'NP.lib.data.Store',
	
    model: 'NP.model.notification.EmailAlertType',

    service: 'NotificationService',
    action : 'getAlertTypes',

    autoLoad: true,

    storeId: 'notification.EmailAlertTypes'
});