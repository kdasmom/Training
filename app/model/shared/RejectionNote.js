/**
 * Model for a RejectionNote
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.shared.RejectionNote', {
	extend: 'Ext.data.Model',
	
	idProperty: 'rejectionnote_id',
	fields: [
		{ name: 'rejectionnote_id', type: 'int' },
		{ name: 'rejectionnote_text' },
		{ name: 'asp_client_id', type: 'int' },
		{ name: 'rejectionnote_type' },
		{ name: 'universal_field_status', type: 'int' }
	]
});