/**
 * Store for FiscalCals. This store uses the FiscalCal fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to FiscalCal.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.property.FiscalCals', {
    extend: 'NP.lib.data.Store',
	
    requires: ['NP.model.property.FiscalCal'],

    model: 'NP.model.property.FiscalCal'
});