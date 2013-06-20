/**
 * Store for Properties. This store uses the Property fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to Property.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.property.Properties', {
    extend: 'NP.lib.data.Store',
	
    model: 'NP.model.property.Property'
});