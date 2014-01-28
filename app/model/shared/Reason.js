/**
 * Model for a Reason
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.shared.Reason', {
	extend: 'Ext.data.Model',
	
	idProperty: 'reason_id',
	fields: [
		{ name: 'reason_id', type: 'int' },
		{ name: 'reason_text' },
		{ name: 'asp_client_id', type: 'int' },
		{ name: 'objtype_id', type: 'int' },
		{ name: 'universal_field_status', type: 'int' }
	]
});