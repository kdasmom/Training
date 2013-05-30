/**
 * Model for a FiscalCalMonth
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.property.FiscalCalMonth', {
	extend: 'NP.lib.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'fiscalcalmonth_id',
	fields: [
		{ name: 'fiscalcalmonth_id', type: 'int' },
		{ name: 'fiscalcal_id', type: 'int' },
		{ name: 'fiscalcalmonth_num', type: 'int' },
		{ name: 'fiscalcalmonth_cutoff', type: 'int' }
	]
});