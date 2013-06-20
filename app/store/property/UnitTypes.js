/**
 * Store for UnitTypes. This store uses the UnitType fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to UnitType.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.property.UnitTypes', {
    extend: 'NP.lib.data.Store',
	
    model: 'NP.model.property.UnitType'
});