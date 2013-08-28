/**
 * Model for a InsuranceType
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.vendor.InsuranceType', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'insurancetype_id',
	fields: [
		{ name: 'insurancetype_id', type: 'int' },
		{ name: 'insurancetype_name' },
		{ name: 'asp_client_id', type: 'int' },
		{ name: 'universal_field_status', type: 'int' }
	]
});