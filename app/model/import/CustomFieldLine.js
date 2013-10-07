/**
 * Model for a CustomFieldHeader
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.import.CustomFieldLine', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'CustomField' },
		{ name: 'validation_status' }
	]
});