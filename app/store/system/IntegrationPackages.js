/**
 * Store for IntegrationPackages. This store uses the IntegrationPackage fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to IntegrationPackage.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.system.IntegrationPackages', {
    extend: 'NP.lib.data.Store',
	
    model: 'NP.model.system.IntegrationPackage'
});