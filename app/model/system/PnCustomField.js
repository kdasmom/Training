/**
 * Model for a PnCustomField
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.system.PnCustomField', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'customfield_id',
	fields: [
		{ name: 'customfield_id', type: 'int' },
		{ name: 'customfield_name' },
		{ name: 'customfield_label' },
		{ name: 'customfield_required' },
		{ name: 'customfield_type' },
		{ name: 'customfield_max_length' },
		{ name: 'universal_field_number', type: 'int' },
		{ name: 'customfield_table' },
		{ name: 'customfield_pn_type' },
		{ name: 'customfield_status' },
		{ name: 'customfield_createdt', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'customfield_createdby', type: 'int' },
		{ name: 'customfield_lastupdatedt', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'customfield_lastupdateby', type: 'int' }
	],

	validations: [
		{ field: 'customfield_name', type: 'length', max: 255 },
		{ field: 'customfield_label', type: 'length', max: 500 },
		{ field: 'customfield_type', type: 'length', max: 255 },
		{ field: 'customfield_max_length', type: 'length', max: 5 },
		{ field: 'customfield_table', type: 'length', max: 255 },
		{ field: 'customfield_pn_type', type: 'length', max: 255 },
		{ field: 'customfield_createdt', type: 'presence' }
	]
});